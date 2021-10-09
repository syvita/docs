---
title: Running a mainnet node
description: Set up and run a mainnet node with Docker
icon: MainnetIcon
duration: 15 minutes
experience: beginners
tags:
  - tutorial
images:
  large: /images/pages/mainnet.svg
  sm: /images/pages/mainnet-sm.svg
---

## Introduction

This guide shows how to run a Stacks mainnet node using Docker images.

It uses [Hiro's implementation](https://github.com/blockstack/stacks-blockchain) of a Stacks node, along with [Bitcoin Core](https://github.com/bitcoin/bitcoin).

-> This procedure focuses on Unix-like operating systems (Linux and MacOS). This procedure has not been tested on Windows.

## Prerequisites

Running a node has no specialized hardware requirements. Users have been successful in running nodes on Raspberry Pi boards and other system-on-chip architectures. In order to complete this procedure, you must have the following software installed on the node host machine:

- [Docker](https://docs.docker.com/get-docker/)
- [curl](https://curl.se/download.html)
- [jq](https://stedolan.github.io/jq/download/)

You can use `brew install docker curl jq` for MacOS and usually `sudo apt-get install docker curl jq` for Linux. But this might not work for every system.

You'll need at minimum 500GB for the Bitcoin Core node and somewhere around 20GB (as of block `704197`). This will grow in size, so a 1TB or more drive is usually recommended for future-proofing.

### Firewall configuration

In order for the API node services to work correctly, you must configure any network firewall rules to allow traffic on the ports discussed in this section. The details of network and firewall configuration are specific to your setup and network, so we won't provide a detailed example.

The following ports must open on the host machine:

Ingress:

- stacks-blockchain (open to `0.0.0.0/0`):
  - `20443 TCP`
  - `20444 TCP`

Egress:

- `8332`
- `8333`
- `20443-20444`

These egress ports are for syncing [`stacks-blockchain`][] and Bitcoin headers. If they're not open, the sync will fail.

## Step 1: initial setup

In order to run the mainnet node, you must download the Docker images and create a directory structure to hold the
persistent data from the services. Download and configure the Docker images with the following commands:

```sh
docker pull blockstack/stacks-blockchain
```

Create some directories for the Stacks data with the following command:

```sh
mkdir -p ./stacks-node/{persistent-data/stacks-blockchain/mainnet,config/mainnet} && cd stacks-node
```

## Step 2: running Bitcoin Core

Stacks finds its blocks by looking through the Bitcoin chain for anchor transactions that store the hashes of Stacks blocks. This is one of the things that makes Stacks so secure.

You'll need to be running an **unpruned** Bitcoin Core node for your Stacks node to sync from.

You'll want your Bitcoin node config to look something like this...

```toml
# remove if you like, this lets the node use more threads
par=512
server=1
txindex=1
# comment this back in after the initial block download if you want to use TOR. 
# you'll need to add TOR and the config separately. 
# there are guides for this elsewhere :)
# onlynet=onion
daemon=1
# hiro's implementation uses rpc v0
rpcserialversion=0
maxorphantx=1
banscore=1
bind=0.0.0.0:8333
rpcbind=0.0.0.0:8332
rpcport=8332
```

There are plenty of guides on how to run a Bitcoin Core node. Do a search and you'll find more indepth info.

If you're on Linux, Bitcoin Core will load the config from `~/.bitcoin/bitcoin.conf` by default. 

On MacOS, it loads from `~/Library/Application Support/Bitcoin/bitcoin.conf`.

-> Wait 'til your Bitcoin Core node is fully synced to the rest of the chain before proceeding to connect your Stacks node to it

## Step 3: running the Stacks node

After Bitcoin Core has synced, create the `./config/Config.toml` file and add the following content to the file using a text editor:

```toml
# stacks node config
[node]
# where the node stores stacks chain data
working_dir = "~/stacks-node/data"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
# the nodes used to bootstrap your node
# these are hiro's nodes, but you can use any other nodes too
bootstrap_node = "02da7a464ac770ae8337a343670778b93410f2f3fef6bea98dd1c3e9224459d36b@seed-0.mainnet.stacks.co:20444,02afeae522aab5f8c99a00ddf75fbcb4a641e052dd48836408d9cf437344b63516@seed-1.mainnet.stacks.co:20444,03652212ea76be0ed4cd83a25c06e57819993029a7b9999f7d63c36340b34a4e62@seed-2.mainnet.stacks.co:20444"

# time in ms to wait for a microblock
wait_time_for_microblocks = 10000

# bitcoin rpc config
[burnchain]
chain = "bitcoin"
mode = "mainnet"
# host is usually `localhost` if you're running Bitcoin Core on the same machine
peer_host = "<YOUR_BTC_CORE_HOST>"
# leave as "" if you didn't set them in your Bitcoin config
username = "<BTC_RPC_USERNAME>"
password = "<BTC_RPC_PW>"
rpc_port = 8332
peer_port = 8333
```

Start the [`stacks-blockchain`][] container with the following command:

```sh
docker run -d --name stacks-blockchain -v $(pwd)/persistent-data/stacks-blockchain/mainnet:/root/stacks-node/data -v $(pwd)/config/mainnet:/src/stacks-node -p 20443:20443 -p 20444:20444 blockstack/stacks-blockchain /bin/stacks-node start --config /src/stacks-node/Config.toml
```

You can verify the running [`stacks-blockchain`][] container with the command:

```sh
docker ps --filter name=stacks-blockchain
```

If you want more verbose output, you can add an environment variable to the container - `STACKS_LOG_DEBUG=1`

## Step 3: verifying the services

-> The initial burnchain header sync can take several minutes, until this is done the following commands will not work

To verify the [`stacks-blockchain`][] burnchain header sync progress:

```sh
docker logs stacks-blockchain
```

The output should be similar to the following:

```
INFO [1626290705.886954] [src/burnchains/bitcoin/spv.rs:926] [main] Syncing Bitcoin headers: 1.2% (8000 out of 691034)
INFO [1626290748.103291] [src/burnchains/bitcoin/spv.rs:926] [main] Syncing Bitcoin headers: 1.4% (10000 out of 691034)
INFO [1626290776.956535] [src/burnchains/bitcoin/spv.rs:926] [main] Syncing Bitcoin headers: 1.7% (12000 out of 691034)
```

To verify the [`stacks-blockchain`][] tip height is progressing use the following command.

-> This normally will only work once all Bitcoin headers have been synced and it starts to pull the Stacks blocks from the chain

```sh
curl -sL localhost:20443/v2/info | jq
```

You should get something like this back.

```json
{
  "peer_version": 402653184,
  "pox_consensus": "89d752034e73ed10d3b97e6bcf3cff53367b4166",
  "burn_block_height": 666143,
  "stable_pox_consensus": "707f26d9d0d1b4c62881a093c99f9232bc74e744",
  "stable_burn_block_height": 666136,
  "server_version": "stacks-node 2.0.11.1.0-rc1 (master:67dccdf, release build, linux [x86_64])",
  "network_id": 1,
  "parent_network_id": 3652501241,
  "stacks_tip_height": 61,
  "stacks_tip": "e08b2fe3dce36fd6d015c2a839c8eb0885cbe29119c1e2a581f75bc5814bce6f",
  "stacks_tip_consensus_hash": "ad9f4cb6155a5b4f5dcb719d0f6bee043038bc63",
  "genesis_chainstate_hash": "74237aa39aa50a83de11a4f53e9d3bb7d43461d1de9873f402e5453ae60bc59b",
  "unanchored_tip": "74d172df8f8934b468c5b0af2efdefe938e9848772d69bcaeffcfe1d6c6ef041",
  "unanchored_seq": 0,
  "exit_at_block_height": null
}
```

## Stopping the mainnet node

Use the following commands to stop the local mainnet node:

```sh
docker stop stacks-blockchain
```

## Additional reading

- [Running an API instance with Docker][]
  [running a testnet node with docker]: /understand-stacks/running-testnet-node
  [running an api instance with docker]: /understand-stacks/running-api-node
  [`stacks-blockchain`]: https://github.com/blockstack/stacks-blockchain

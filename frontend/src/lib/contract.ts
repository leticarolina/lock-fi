import type { Abi, Address } from 'viem'
import watcherAbiJson from '../../Watcher.abi.json'

// export const WATCHER_ADDRESS: Address = '0xB0c7a97cEE61d3Da05e2cF4Fb704e44d2bdFc230'
export const WATCHER_ADDRESS: Address = '0xfCAC3d132D632107eBc317a6152E416d73b24F78'

export const watcherAbi = watcherAbiJson as Abi

export const watcherContract = {
  address: WATCHER_ADDRESS,
  abi: watcherAbi,
} as const

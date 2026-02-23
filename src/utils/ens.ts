import { ethers } from "ethers";
import { requireWeb3PublicConfig } from "@/utils/web3Config";

export interface EnsResolution {
  inputName: string;
  resolvedAddress: string | null;
  reverseName: string | null;
  forwardMatchesInput: boolean;
  reverseMatchesInput: boolean;
  isVerified: boolean;
  error?: string;
}

let provider: ethers.providers.JsonRpcProvider | null = null;
let providerUrl: string | null = null;
const resolutionCache = new Map<string, Promise<EnsResolution>>();

const normalizeName = (value: string): string => value.trim().toLowerCase().replace(/\.$/, "");

const getProvider = (): ethers.providers.JsonRpcProvider => {
  const cfg = requireWeb3PublicConfig();
  const { rpcUrl, chainId } = cfg;
  if (!provider || providerUrl !== rpcUrl) {
    provider = new ethers.providers.JsonRpcProvider(rpcUrl, chainId);
    providerUrl = rpcUrl;
  }
  return provider;
};

export const resolveEnsProfile = async (name: string): Promise<EnsResolution> => {
  const normalizedInput = normalizeName(name);
  const cached = resolutionCache.get(normalizedInput);
  if (cached) return cached;

  const task = (async (): Promise<EnsResolution> => {
    try {
      const rpc = getProvider();
      const resolved = await rpc.resolveName(normalizedInput);

      if (!resolved || !ethers.utils.isAddress(resolved)) {
        return {
          inputName: normalizedInput,
          resolvedAddress: null,
          reverseName: null,
          forwardMatchesInput: false,
          reverseMatchesInput: false,
          isVerified: false
        };
      }

      const checksumAddress = ethers.utils.getAddress(resolved);
      const reverse = await rpc.lookupAddress(checksumAddress);
      const normalizedReverse = reverse ? normalizeName(reverse) : null;
      const forwardAgain = normalizedReverse ? await rpc.resolveName(normalizedReverse) : null;

      const forwardMatchesInput = ethers.utils.isAddress(resolved);
      const reverseMatchesInput = normalizedReverse === normalizedInput;
      const reverseForwardMatches = forwardAgain
        ? ethers.utils.getAddress(forwardAgain) === checksumAddress
        : false;

      return {
        inputName: normalizedInput,
        resolvedAddress: checksumAddress,
        reverseName: normalizedReverse,
        forwardMatchesInput,
        reverseMatchesInput,
        isVerified: forwardMatchesInput && reverseMatchesInput && reverseForwardMatches
      };
    } catch (error) {
      return {
        inputName: normalizedInput,
        resolvedAddress: null,
        reverseName: null,
        forwardMatchesInput: false,
        reverseMatchesInput: false,
        isVerified: false,
        error: error instanceof Error ? error.message : "Unknown ENS resolution error"
      };
    }
  })();

  resolutionCache.set(normalizedInput, task);
  return task;
};

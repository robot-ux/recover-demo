import { ProposalTypes } from "@walletconnect/types";
import { DEFAULT_COSMOS_METHODS } from "./constants";

export interface ChainNamespaces {
  [namespace: string]: {
    [reference: string]: {
      name: string;
      id: string;
      rpc: string[];
      slip44: number;
      testnet: boolean;
    };
  };
}

export interface AssetData {
  account: string;
  symbol: string;
  balance: string;
  contractAddress?: string;
}

export const DEFAULT_CHAINS = ['bbc:Binance-Chain-Ganges'];
export enum DEFAULT_EVENTS {
  ETH_CHAIN_CHANGED = "chainChanged",
  ETH_ACCOUNTS_CHANGED = "accountsChanged",
}


export const getNamespacesFromChains = (chains: string[]) => {
  const supportedNamespaces: string[] = [];
  chains.forEach((chainId) => {
    const [namespace] = chainId.split(":");
    if (!supportedNamespaces.includes(namespace)) {
      supportedNamespaces.push(namespace);
    }
  });

  return supportedNamespaces;
};

export const getSupportedRequiredMethodsByNamespace = (namespace: string) => {
  switch (namespace) {
    case "bbc":
      return Object.values(DEFAULT_COSMOS_METHODS);
    default:
      throw new Error(
        `No default required methods for namespace: ${namespace}`
      );
  }
};

export const getSupportedOptionalMethodsByNamespace = (namespace: string) => {
  switch (namespace) {
    case "bbc":
      return Object.values(DEFAULT_COSMOS_METHODS);
    default:
      throw new Error(
        `No default optional methods for namespace: ${namespace}`
      );
  }
};

export const getSupportedEventsByNamespace = (namespace: string) => {
  return Object.values(DEFAULT_EVENTS);
};

export const getRequiredNamespaces = (
  chains: string[]
): ProposalTypes.RequiredNamespaces => {
  const selectedNamespaces = getNamespacesFromChains(chains);
  console.log("selected required namespaces:", selectedNamespaces);

  return Object.fromEntries(
    selectedNamespaces.map((namespace) => [
      namespace,
      {
        methods: getSupportedRequiredMethodsByNamespace(namespace),
        chains: chains.filter((chain) => chain.startsWith(namespace)),
        events: getSupportedEventsByNamespace(namespace) as any[],
      },
    ])
  );
};

export const getOptionalNamespaces = (
  chains: string[]
): ProposalTypes.OptionalNamespaces => {
  const selectedNamespaces = getNamespacesFromChains(chains);
  console.log("selected optional namespaces:", selectedNamespaces);

  return Object.fromEntries(
    selectedNamespaces.map((namespace) => [
      namespace,
      {
        methods: getSupportedOptionalMethodsByNamespace(namespace),
        chains: chains.filter((chain) => chain.startsWith(namespace)),
        events: [],
      },
    ])
  );
};


export const getAllChainNamespaces = () => {
  const namespaces: string[] = [];
  DEFAULT_CHAINS.forEach(chainId => {
    const [namespace] = chainId.split(":");
    if (!namespaces.includes(namespace)) {
      namespaces.push(namespace);
    }
  });
  return namespaces;
};



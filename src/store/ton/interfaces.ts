export type fetchStatus = 'idle' | 'loading' | 'succeed' | 'failed';

export interface IPairMeta {
  base: string;
  baseAddress: string;
  counterAddress: string;
  counter: string;
  poolAddress: string;
  fee: string;
}

export interface IPair {
  meta: IPairMeta;
  tvl: string;
  tvlChange: string,
  leftLocked: string,
  leftPrice: string,
  rightLocked: string,
  rightPrice: string,
  volume24h: string,
  volumeChange24h: string,
  volume7d: string,
  fee24h: string,
  fee7d: string,
  feeAllTime: string
}

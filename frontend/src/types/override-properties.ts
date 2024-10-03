export type OverrideProperties<
  Src extends Record<string, unknown>,
  Dst extends { [DstKey in keyof Dst]?: DstKey extends keyof Src ? unknown : never }
> = Omit<Src, keyof Dst> & Dst;

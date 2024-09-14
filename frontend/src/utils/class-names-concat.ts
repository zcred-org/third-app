export function classNamesConcat(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}

export const countWords = (value: string, separator: string): number => value.trim()
                                                                             .split( separator ).length;

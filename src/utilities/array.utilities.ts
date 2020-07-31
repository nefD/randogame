export const uniqueArray = <T>(arr: T[]) => arr.filter((value, index, self) => self.indexOf(value) === index);

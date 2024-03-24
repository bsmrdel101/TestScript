export type Token = {
  type: string
  value: string
};

export type Variable = {
  name: string
  value?: string
};

export type Error = {
  error: string | boolean
};

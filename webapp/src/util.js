import sjcl from 'sjcl'

export const encryptSHA256 = (string) => sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(string))
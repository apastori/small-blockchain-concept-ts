import { objectStrKeyIntValue } from "../types/objectStrKeyIntValue"
import { objectStrKeyProp } from "../types/objectStrKeyProp"
import { cryptoHash } from "./cryptoHash"

describe('crypto hash function to generate SHA-3 Hash', () => {
    it('generates a SHA-3 hashed output of 256 bits', () => {
        expect<string>(cryptoHash('foo')).toEqual('76d3bc41c9f588f7fcd0d5bf4718f8f84b1c41b20882703100b9eb9413807c01')
    })
    it('produces the same hash with the same input arguments in any order', () => {
        expect<string>(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'))
    })
    it('produces a unique hash when the properties have changed on an input', () => {
        const foo: objectStrKeyProp = {}
        const originalHash = cryptoHash(foo)
        foo['a'] = 'a'
        expect<string>(cryptoHash(foo)).not.toEqual(originalHash)
    })
})
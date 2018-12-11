
class ByteHexMappings {
    byteToHex: string[] = [];
    hexToByte: { [hex: string]: number; } = {};

    constructor() {
        for (let i = 0; i < 256; i++) {
            this.byteToHex[i] = (i + 0x100).toString(16).substr(1);
            this.hexToByte[this.byteToHex[i]] = i;
        }
    }
}

export class Utils {

    public api: string = "https://ancient-fjord-87958.herokuapp.com/api/v1";

    public uuid() {
        return this.uuidToString(this.getUuidV4());
    }
    private getRandomFromMathRandom() {
        const result = new Array(16);

        let r = 0;
        for (let i = 0; i < 16; i++) {
            if ((i & 0x03) === 0) {
                r = Math.random() * 0x100000000;
            }
            result[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return result;


    }
    private getUuidV4() {
        const result = this.getRandomFromMathRandom();

        // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
        result[6] = (result[6] & 0x0f) | 0x40;
        result[8] = (result[8] & 0x3f) | 0x80;

        return result;
    }

    private uuidToString(buf: ArrayLike<number>, offset: number = 0) {
        const byteHexMappings = new ByteHexMappings();
        let i = offset;
        const bth = byteHexMappings.byteToHex;
        return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + "-" +
            bth[buf[i++]] + bth[buf[i++]] + "-" +
            bth[buf[i++]] + bth[buf[i++]] + "-" +
            bth[buf[i++]] + bth[buf[i++]] + "-" +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];

    }
}
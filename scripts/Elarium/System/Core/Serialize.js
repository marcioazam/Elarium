export class BinarySerializer {
    constructor() {
        this.buffer = new ArrayBuffer(256);
        this.view = new DataView(this.buffer);
        this.offset = 0;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }

    // Método público para serialização
    serialize(data) {
        this._growBuffer(64);
        this._writeData(data);
        return new Uint8Array(this.buffer, 0, this.offset);
    }

    // Método público para desserialização
    deserialize(bytes) {
        this.buffer = bytes.buffer;
        this.view = new DataView(this.buffer);
        this.offset = 0;
        return this._readData();
    }

    // Métodos privados de serialização
    _writeData(data) {
        const type = typeof data;
        
        if (data === null) {
            this._writeByte(0);
        } else if (data instanceof Uint8Array) {
            this._writeByte(1);
            this._writeUint32(data.length);
            this._writeRawBytes(data);
        } else if (data instanceof Array) {
            this._writeByte(2);
            this._writeUint32(data.length);
            data.forEach(item => this._writeData(item));
        } else if (type === 'object') {
            this._writeByte(3);
            const keys = Object.keys(data);
            this._writeUint32(keys.length);
            keys.forEach(key => {
                this._writeString(key);
                this._writeData(data[key]);
            });
        } else if (type === 'string') {
            this._writeByte(4);
            this._writeString(data);
        } else if (type === 'number') {
            this._writeByte(5);
            this._writeDouble(data);
        } else if (type === 'boolean') {
            this._writeByte(6);
            this._writeByte(data ? 1 : 0);
        } else if (type === 'bigint') {
            this._writeByte(7);
            this._writeBigInt(data);
        }
    }

    // Métodos privados de desserialização
    _readData() {
        const type = this._readByte();
        
        switch(type) {
            case 0: return null;
            case 1: return this._readUint8Array();
            case 2: return this._readArray();
            case 3: return this._readObject();
            case 4: return this._readString();
            case 5: return this._readDouble();
            case 6: return this._readBoolean();
            case 7: return this._readBigInt();
            default: throw new Error("Tipo desconhecido: " + type);
        }
    }

    // Métodos auxiliares para tipos específicos
    _writeString(str) {
        const encoded = this.encoder.encode(str);
        this._writeUint32(encoded.length);
        this._writeRawBytes(encoded);
    }

    _readString() {
        const length = this._readUint32();
        return this.decoder.decode(new Uint8Array(this.buffer, this.offset, length));
    }

    _writeBigInt(value) {
        const isNegative = value < 0n;
        const hexString = value.toString(16).padStart(32, '0');
        const bytes = new Uint8Array(hexString.match(/.{2}/g).map(b => parseInt(b, 16)));
        this._writeByte(isNegative ? 1 : 0);
        this._writeRawBytes(bytes);
    }

    _readBigInt() {
        const isNegative = this._readByte() === 1;
        const bytes = new Uint8Array(this.buffer, this.offset, 16);
        this.offset += 16;
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        return BigInt(`${isNegative ? '-' : ''}0x${hex}`);
    }

    // Métodos de baixo nível para manipulação do buffer
    _growBuffer(needed) {
        if (this.offset + needed <= this.buffer.byteLength) return;

        const newBuffer = new ArrayBuffer(this.buffer.byteLength * 2);
        new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
        this.buffer = newBuffer;
        this.view = new DataView(this.buffer);
    }

    _writeRawBytes(data) {
        this._growBuffer(data.length);
        new Uint8Array(this.buffer).set(data, this.offset);
        this.offset += data.length;
    }

    _writeByte(value) {
        this._growBuffer(1);
        this.view.setUint8(this.offset++, value);
    }

    _writeUint32(value) {
        this._growBuffer(4);
        this.view.setUint32(this.offset, value, true);
        this.offset += 4;
    }

    _writeDouble(value) {
        this._growBuffer(8);
        this.view.setFloat64(this.offset, value, true);
        this.offset += 8;
    }

    _readByte() {
        return this.view.getUint8(this.offset++);
    }

    _readUint32() {
        const value = this.view.getUint32(this.offset, true);
        this.offset += 4;
        return value;
    }

    _readDouble() {
        const value = this.view.getFloat64(this.offset, true);
        this.offset += 8;
        return value;
    }

    _readUint8Array() {
        const length = this._readUint32();
        const data = new Uint8Array(this.buffer, this.offset, length);
        this.offset += length;
        return data;
    }

    _readArray() {
        const length = this._readUint32();
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(this._readData());
        }
        return arr;
    }

    _readObject() {
        const length = this._readUint32();
        const obj = {};
        for (let i = 0; i < length; i++) {
            const key = this._readString();
            obj[key] = this._readData();
        }
        return obj;
    }

    _readBoolean() {
        return this._readByte() === 1;
    }
}

// // Exemplo de uso para Bedrock mods
// const serializer = new BinarySerializer();

// // Exemplo de dados complexos típico de mods
// const gameData = {
//     player: {
//         name: "Steve",
//         position: [1234.56, 64.0, -789.01],
//         inventory: new Uint8Array([1, 2, 3, 4, 5]),
//         health: 20.5,
//         experience: 12345678901234567890n
//     },
//     entities: [
//         { type: "zombie", position: [123, 64, 456] },
//         { type: "skeleton", position: [789, 64, 123] }
//     ],
//     timestamp: Date.now()
// };

// // Serialização
// const serialized = serializer.serialize(gameData);
// console.log("Dados serializados:", serialized);

// // Desserialização
// const deserialized = serializer.deserialize(serialized);
// console.log("Dados reconstruídos:", deserialized);
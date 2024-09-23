import crypto from 'crypto';

class WebClasses {
  private skey: string;
  private key: Buffer;
  private IV: Buffer;

  constructor() {
    this.skey = '*&@?#;<>'; // Secret key (8 or 16 characters)
    this.key = Buffer.alloc(0);
    this.IV = Buffer.from([18, 52, 86, 120, 144, 171, 205, 239]); // Initialization vector (IV)
  }

  // Encryption with DES
  encryptText(strText: string): string {
    return this.encrypt(strText, this.skey);
  }

  // Encryption with TripleDES
  encryptTextTdes(strText: string): string {
    return this.encryptTDes(strText, this.skey);
  }

  // Decryption with DES
  decryptText(strText: string): string {
    return this.decrypt(strText, this.skey);
  }

  // Decryption with TripleDES
  decryptTextTdes(strText: string): string {
    return this.decryptTDes(strText, this.skey);
  }

  // Format Money (use JavaScript built-in number formatting)
  formatMoney(Dmoney: string): string {
    const moneyValue = parseFloat(Dmoney);
    return moneyValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // DES Decryption
  decrypt(stringToDecrypt: string, sEncryptionKey: string): string {
    try {
      this.key = Buffer.from(sEncryptionKey.substring(0, 8), 'utf-8'); // Use the first 8 characters of the key
      const decipher = crypto.createDecipheriv('des', this.key, this.IV);
      let decrypted = decipher.update(Buffer.from(stringToDecrypt, 'base64'), 'binary', 'utf-8');
      decrypted += decipher.final('utf-8');
      return decrypted;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  // TripleDES Decryption
  decryptTDes(stringToDecrypt: string, sEncryptionKey: string): string {
    try {
      this.key = Buffer.from(sEncryptionKey.substring(0, 16), 'utf-8'); // Use the first 16 characters of the key
      const decipher = crypto.createDecipheriv('des-ede3', this.key, this.IV);
      let decrypted = decipher.update(Buffer.from(stringToDecrypt, 'base64'), 'binary', 'utf-8');
      decrypted += decipher.final('utf-8');
      return decrypted;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  // DES Encryption
  encrypt(stringToEncrypt: string, SEncryptionKey: string): string {
    try {
      this.key = Buffer.from(SEncryptionKey.substring(0, 8), 'utf-8'); // Use the first 8 characters of the key
      const cipher = crypto.createCipheriv('des', this.key, this.IV);
      let encrypted = cipher.update(stringToEncrypt, 'utf-8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  // TripleDES Encryption
  encryptTDes(stringToEncrypt: string, SEncryptionKey: string): string {
    try {
      this.key = Buffer.from(SEncryptionKey.substring(0, 16), 'utf-8'); // Use the first 16 characters of the key
      const cipher = crypto.createCipheriv('des-ede3', this.key, this.IV);
      let encrypted = cipher.update(stringToEncrypt, 'utf-8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }
}

export default WebClasses;

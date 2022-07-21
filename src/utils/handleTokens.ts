const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const  create = async (tokenData: any) => {
  try {
    const fileName = uuidv4();
    const dir = path.join(process.cwd() + `/tokenData`);
    
    const createDirectory = !fs.existsSync(dir) && fs.mkdirSync(dir);
    const file = path.join(dir, `${fileName}.json`);
    await fs.writeFileSync(file, tokenData);
    return fileName;
  } catch (error) {
    return error;
  }
};

const read = async (fileName: string) => {
  try{
    const dir = path.join(process.cwd() + `/tokenData`);
    const filePath = path.join(dir, `${fileName}.json`);
    const token = fs.readFileSync(filePath);
    return JSON.parse(token);
  } catch (error){
    return error;
  }
}
export const handleTokens = {
  create,
  read,
};
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { handleTokens } from '@/utils/handleTokens';
import { PrismaClient } from '@prisma/client';

type Data = {
  result: string
}

const prisma = new PrismaClient();

const cors = Cors({
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  origin: '*',
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse<Data>, fn: { (req: Cors.CorsRequest, res: { statusCode?: number | undefined; setHeader(key: string, value: string): any; end(): any; }, next: (err?: any) => any): void; (arg0: any, arg1: any, arg2: (result: any) => void): void; }) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors)  

  const userId = await handleTokens.create(req.body.tokenData);
  let stringAvailableThemes: string = '', stringThemeObjects: string = '';
  req.body.availableThemes.map((theme: any) => stringAvailableThemes += JSON.stringify(theme) + '---');
  req.body.themeObjects.map((themeObject: any) => stringThemeObjects += JSON.stringify(themeObject) + '---');
  
  await prisma.tokenData.create({
    data:{
      userId: userId,
      activeTheme: req.body.activeTheme !== null ? req.body.activeTheme : '',
      availableThemes: stringAvailableThemes.slice(0, -3),
      usedTokenSet: JSON.stringify(req.body.usedTokenSet),
      themeObjects: stringThemeObjects.slice(0, -3),
    }
  });
  
  return res.status(200).json({result: userId});  
}

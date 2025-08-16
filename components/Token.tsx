import { useState } from "react"
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useEffect } from "react";

type TokenInfo = {
    mint: string;
    amount: number;
    tokenAccount: string;
    authority?: string
}
 
export const Token = ({publicKey}: {publicKey: string }) => {
    const [allTokens, setAllTokens] = useState<TokenInfo[]>([]);

    useEffect(() => {
        const getUserTokens = async () => {
            const connection = new Connection("https://api.devnet.solana.com");
            const walletAddress = new PublicKey(publicKey);

            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                walletAddress,
                {
                    programId: TOKEN_PROGRAM_ID
                }
            )
            const tokens: TokenInfo[] = [];
            for(const {pubkey, account} of tokenAccounts.value) {
                const info = account.data.parsed.info;
                const mint = info.mint;
                const amount = info.tokenAmount.uiAmount;

                if(amount > 0) {
                    tokens.push(
                        {
                            mint,
                            amount,
                            tokenAccount: pubkey.toBase58(),
                        }
                    )
                }
            }

            setAllTokens(tokens);
        }
        getUserTokens();
    }, [publicKey])

  return (
    <div>
        <h2 className="text-xl font-bold mb-4">Your Tokens</h2>
        <div className="grid grid-cols-1 gap-4">
            {allTokens.map((token, index) => (
                <div key={index} className="p-4 border rounded-lg">
                    <div>Mint: {token.mint}</div>
                    <div>Amount: {token.amount}</div>
                    <div>Token Account: {token.tokenAccount}</div>
                </div>
            ))}
        </div>
    </div>
  )
}

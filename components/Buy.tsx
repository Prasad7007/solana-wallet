import { FaucetButton } from '@/components/FaucetButton';

export const Buy = ({walletAddress}: {walletAddress: string}) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Faucet</h2>
      <FaucetButton publicKey={walletAddress}/>
    </div>
  )
}

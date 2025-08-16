'use client';

import { LAMPORTS_PER_SOL, Connection, PublicKey } from '@solana/web3.js';
import { useState } from 'react';

export function FaucetButton({ publicKey }: { publicKey: string | null }) {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const connection = new Connection('https://api.devnet.solana.com');

  const airdrop = async () => {
    setError(null);
    setSuccess(null);

    // Validate amount
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError('❌ Please enter a valid amount > 0');
      return;
    }

    // Validate public key
    if (!publicKey) {
      setError('❌ Wallet address missing or not connected.');
      return;
    }

    setLoading(true);

    try {
      const walletAddress = new PublicKey(publicKey);
      const lamports = amountNumber * LAMPORTS_PER_SOL;

      const sig = await connection.requestAirdrop(walletAddress, lamports);
      await connection.confirmTransaction(sig, 'confirmed');

      setSuccess(`✅ Airdropped ${amountNumber} SOL to ${walletAddress.toBase58()}`);
      setAmount('');
    } catch (err) {
      const errorObj = err as Error;
      const raw = errorObj?.message || errorObj?.toString() || 'Unknown error';
      if (raw.includes('429') || raw.toLowerCase().includes('rate')) {
        setError('🚫 Rate limit hit. Try again in a few hours.');
      } else {
        setError(`❌ Error: ${raw}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-4">
      <h2 className="text-xl font-semibold">🧪 Devnet Faucet</h2>

      <div className="flex items-center justify-center gap-2">
        <input
          type="number"
          id="sol"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount of SOL"
          className="p-2 border border-gray-300 rounded w-full"
          step="0.01"
          min="0.01"
        />
        <button
          onClick={airdrop}
          className="p-2 bg-green-600 text-white rounded min-w-[120px]"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Airdrop'}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from 'axios';


type Token = {
    symbol: string;
    icon: string;
    usdPrice: number;
}

export const Swap = () => {
    const [allTokens, setAllTokens] = useState<Token[]>([]);

    useEffect(() => {
        const featchTokens = async() => {
            const response = await axios.get('https://lite-api.jup.ag/tokens/v2/toporganicscore/5m?limit=10');
            const data = response.data;
            setAllTokens(data);
        }
        featchTokens();
    }, []);
  return (
    <div>
        <div>
            {allTokens.map((obj, index) => {
                return (
                    <div key={index} className="flex items-center justify-between p-2 m-2 border-2 rounded-lg border-red-200 bg-red-500">
                        <div className="flex items-center gap-5">
                            <img src={obj.icon} alt={"Token Icons"} width={50} height={50} className="border-2 rounded-full "/>
                            <div >{obj.symbol}</div>
                        </div>
                        <div>{Math.round(obj.usdPrice * 100000000) / 100000000}</div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

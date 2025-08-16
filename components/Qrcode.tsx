import QRCode from "react-qr-code";

export const Qrcode = ({value}: {value: string}) => {
  return (
    <div className="flex items-center justify-center p-4 ">
        <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "40%", width: "40%" }}
            value={value}
            viewBox={`0 0 256 256`}
            className=" border-4 border-red-200 rounded-lg"
        />
    </div>
  )
}

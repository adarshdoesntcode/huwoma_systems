import QRCode from "react-qr-code";

function PublicEntryQrCard({ qrCardRef, publicEntryUrl }) {
  return (
    <div className="flex justify-center">
      <div
        ref={qrCardRef}
        className="flex flex-col items-center gap-3 p-4 bg-white border rounded-lg"
      >
        <QRCode size={240} className="p-1 rounded-md" value={publicEntryUrl} />
      </div>
    </div>
  );
}

export default PublicEntryQrCard;

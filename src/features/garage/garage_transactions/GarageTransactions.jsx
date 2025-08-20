import NavBackButton from "@/components/NavBackButton";

function GarageTransactions() {
  return (
    <div className="mb-64 space-y-4 ">
      <NavBackButton buttonText={"Back"} navigateTo={-1} />
    </div>
  );
}

export default GarageTransactions;

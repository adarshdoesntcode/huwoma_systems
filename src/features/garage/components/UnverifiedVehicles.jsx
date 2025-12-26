import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, X } from 'lucide-react';
import { useGetUnverifiedVehicleCountQuery } from '../garageApiSlice';

const UnverifiedVehicles = ({ query, setQuery }) => {
    const { data, isSuccess } = useGetUnverifiedVehicleCountQuery();

    const count = data?.data?.count || 0;

    // Check if currently viewing unverified
    const isViewingUnverified = query?.status === "Unverified" && query?.isVerified === false;

    const handleShowUnverified = () => {
        setQuery({ status: "Unverified", isVerified: false });
    };

    const handleClear = () => {
        setQuery({ status: "Available", isVerified: true });
    };

    // Only show button if there are unverified vehicles
    if (!isSuccess || count === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-1">
            <Button
                variant={isViewingUnverified ? "default" : "outline"}
                className="gap-2"
                onClick={handleShowUnverified}
            >
                <ShieldAlert className={`w-4 h-4 ${isViewingUnverified ? "text-white" : "text-amber-500"}`} />
                <span className="hidden sm:inline">Unverified</span>
                <Badge
                    variant="secondary"
                    className={isViewingUnverified
                        ? "bg-white/20 text-white hover:bg-white/20"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                    }
                >
                    {count}
                </Badge>
            </Button>
            {isViewingUnverified && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="h-9 w-9"
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
};

export default UnverifiedVehicles;

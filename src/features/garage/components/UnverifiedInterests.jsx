import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, X } from 'lucide-react';
import { useGetUnverifiedInterestCountQuery } from '../garageApiSlice';

const UnverifiedInterests = ({ query, setQuery }) => {
    const { data, isSuccess } = useGetUnverifiedInterestCountQuery();

    const count = data?.data?.count || 0;

    // Check if currently viewing unverified
    const isViewingUnverified = query?.status === "Unverified";

    const handleShowUnverified = () => {
        setQuery({ status: "Unverified" });
    };

    const handleClear = () => {
        setQuery({ status: "Active" });
    };

    // Only show button if there are unverified interests
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
                    title="Clear filter"
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
};

export default UnverifiedInterests;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { useGetVehicleConfigQuery } from "../garageApiSlice";

function PublicVehicleFilters({ filters, setFilters, onClose }) {
    const { data: configData } = useGetVehicleConfigQuery();

    const [localFilters, setLocalFilters] = useState(filters);

    const handleInputChange = (key, value) => {
        setLocalFilters((prev) => {
            if (!value || value === "") {
                const newFilters = { ...prev };
                delete newFilters[key];
                return newFilters;
            }
            return { ...prev, [key]: value };
        });
    };

    const handleApply = () => {
        setFilters(localFilters);
        onClose();
    };

    const handleClear = () => {
        setLocalFilters({});
        setFilters({});
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filter Vehicles</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Make */}
                    <div className="space-y-2">
                        <Label htmlFor="make">Make</Label>
                        <Input
                            id="make"
                            placeholder="e.g., Toyota"
                            value={localFilters.make || ""}
                            onChange={(e) => handleInputChange("make", e.target.value)}
                        />
                    </div>

                    {/* Model */}
                    <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input
                            id="model"
                            placeholder="e.g., Camry"
                            value={localFilters.model || ""}
                            onChange={(e) => handleInputChange("model", e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={localFilters.category || ""}
                            onValueChange={(value) =>
                                handleInputChange("category", value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {configData?.data?.vehicleCategories?.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Transmission */}
                    <div className="space-y-2">
                        <Label htmlFor="transmission">Transmission</Label>
                        <Select
                            value={localFilters.transmission || ""}
                            onValueChange={(value) =>
                                handleInputChange("transmission", value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger id="transmission">
                                <SelectValue placeholder="All Transmissions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Transmissions</SelectItem>
                                {configData?.data?.transmissionTypes?.map((trans) => (
                                    <SelectItem key={trans} value={trans}>
                                        {trans}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Fuel Type */}
                    <div className="space-y-2">
                        <Label htmlFor="fuelType">Fuel Type</Label>
                        <Select
                            value={localFilters.fuelType || ""}
                            onValueChange={(value) =>
                                handleInputChange("fuelType", value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger id="fuelType">
                                <SelectValue placeholder="All Fuel Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Fuel Types</SelectItem>
                                {configData?.data?.fuelTypes?.map((fuel) => (
                                    <SelectItem key={fuel} value={fuel}>
                                        {fuel}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Year Min */}
                    <div className="space-y-2">
                        <Label htmlFor="yearMin">Year From</Label>
                        <Select
                            value={localFilters.yearMin || ""}
                            onValueChange={(value) =>
                                handleInputChange("yearMin", value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger id="yearMin">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any</SelectItem>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Year Max */}
                    <div className="space-y-2">
                        <Label htmlFor="yearMax">Year To</Label>
                        <Select
                            value={localFilters.yearMax || ""}
                            onValueChange={(value) =>
                                handleInputChange("yearMax", value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger id="yearMax">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any</SelectItem>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price Min */}
                    <div className="space-y-2">
                        <Label htmlFor="priceMin">Min Price (₹)</Label>
                        <Input
                            id="priceMin"
                            type="number"
                            placeholder="0"
                            value={localFilters.priceMin || ""}
                            onChange={(e) => handleInputChange("priceMin", e.target.value)}
                        />
                    </div>

                    {/* Price Max */}
                    <div className="space-y-2">
                        <Label htmlFor="priceMax">Max Price (₹)</Label>
                        <Input
                            id="priceMax"
                            type="number"
                            placeholder="Any"
                            value={localFilters.priceMax || ""}
                            onChange={(e) => handleInputChange("priceMax", e.target.value)}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <Button onClick={handleApply} className="flex-1">
                        Apply Filters
                    </Button>
                    <Button onClick={handleClear} variant="outline" className="flex-1">
                        Clear All
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default PublicVehicleFilters;

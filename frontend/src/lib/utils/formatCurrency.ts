type FormatCurrencyOptions = {
    compact?: boolean;
};

export const formatCurrency = (val: number, options?: FormatCurrencyOptions): string => {
    if (!options?.compact) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val);
    }

    const abs = Math.abs(val);
    const sign = val < 0 ? "-" : "";

    if (abs >= 1_000_000_000) {
        const num = abs / 1_000_000_000;
        return `${sign}${+num.toFixed(1)}M`;
    }

    if (abs >= 1_000_000) {
        const num = abs / 1_000_000;
        return `${sign}${+num.toFixed(1)}jt`;
    }

    if (abs >= 1_000) {
        const num = abs / 1_000;
        return `${sign}${+num.toFixed(0)}rb`;
    }

    return `${sign}${abs}`;
};
import { FormProvider, UseFormReturn } from "react-hook-form";

interface Props {
    children: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
}

export default function FormProviderWrapper({
    children,
    form
}: Props) {
    return (
        <FormProvider {...form}>
            {children}
        </FormProvider>
    )
}
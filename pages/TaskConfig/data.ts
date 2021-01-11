import z, { string, number, object } from "zod";

const ValveSchema = number().min(0).max(24);
export const FormSchema = object({
    name: string().max(24),
    date: string().refine(str => str.match(/\d{4}-\d{2}-\d{2}/), {
        message: "Date doesn't match the required form at: yyyy-mm-dd",
    }),
    time: string().refine(str => str.match(/\d{1,2}:\d{1,2}/), {
        message: "Time doesn't match the required format: hh:mm (24hr)",
    }),
    valves: string()
        .nonempty()
        .refine(s => s.split(",").every(n => !isNaN(Number(n))), {
            message: "Input contains non-numeric character or doesn't follow the format",
        })
        .refine(s => s.split(",").every(n => ValveSchema.safeParse(Number(n)).success), {
            message: "Valve number must be >= 0 and <= 23",
        }),
    timeBetween: number().min(0),
    notes: string().optional(),
    flushTime: number().min(0),
    flushVolume: number().min(0),
    sampleTime: number().min(0),
    sampleVolume: number().min(0),
    samplePressure: number().min(0),
    dryTime: number().min(0),
    preserveTime: number().min(0),
});

export type FormValues = z.infer<typeof FormSchema>;

export type FieldProps = {
    name: keyof FormValues;
    label: string;
    type?: "string" | "number" | "date" | "time" | "button";
    sublabel?: string;
    helperText?: string;
};

export const generalFields: FieldProps[] = [
    { name: "name", label: "Task Name", sublabel: "Name unique to this task" },
    {
        name: "date",
        type: "date",
        label: "Schedule Date",
        sublabel: "Date when to execute this task",
        helperText: "Format: yyyy-mm-dd",
    },
    {
        name: "time",
        type: "time",
        label: "Schedule Time",
        sublabel: "Time of the day to execute this task",
        helperText: "Format: hh:mm (pm|am)",
    },
    {
        name: "notes",
        label: "Notes",
        sublabel: "Optional note to remember this task",
    },
];

export const valveFields: FieldProps[] = [
    {
        name: "valves",
        label: "Valves",
        sublabel: "Valves asigned to this task",
        helperText: "Comma-separated valve numbers: eg. 1,2,3,4",
    },
    {
        name: "timeBetween",
        label: "Time Between",
        sublabel: "Time until next valve",
        type: "number",
    },
];

export const flushFields: FieldProps[] = [
    { name: "flushTime", type: "number", label: "Flush Time" },
    { name: "flushVolume", type: "number", label: "Flush Volume" },
];

export const sampleFields: FieldProps[] = [
    { name: "sampleTime", type: "number", label: "Sample Time" },
    { name: "sampleVolume", type: "number", label: "Sample Volume" },
    { name: "samplePressure", type: "number", label: "Sample Pressure" },
];

export const dryFields: FieldProps[] = [{ name: "dryTime", type: "number", label: "Dry Time" }];
export const preserveFields: FieldProps[] = [
    { name: "preserveTime", type: "number", label: "Preserve Time" },
];

export type ConfigSectionName = "general" | "valves" | "flush" | "sample" | "dry" | "preserve";
export const configFields: Record<ConfigSectionName, { title: string; fields: FieldProps[] }> = {
    general: { title: "General", fields: generalFields },
    valves: { title: "Valves", fields: valveFields },
    flush: { title: "Flush", fields: flushFields },
    sample: { title: "Sample", fields: sampleFields },
    dry: { title: "Dry", fields: dryFields },
    preserve: { title: "Preserve", fields: preserveFields },
};

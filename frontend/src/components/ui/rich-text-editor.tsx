"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Emoji, gitHubEmojis } from "@tiptap/extension-emoji";
import { useFormContext, Controller } from "react-hook-form";
import {
    TextBoldIcon,
    TextItalicIcon,
    TextUnderlineIcon,
    Heading01Icon,
    Heading02Icon,
    ListViewIcon,
    LeftToRightListNumberIcon as ListNumberIcon,
    Quote as QuoteIcon,
    SmileIcon,
    CheckmarkCircle02Icon,
    Link01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "@tiptap/extension-link";
import { Button } from "./button";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Input } from "./input";

interface Props {
    name: string;
    withValidation?: boolean;
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
}

const Toolbar = ({ editor }: { editor: Editor | null }) => {
    const [linkData, setLinkData] = useState({ url: "", text: "" });
    const [isLinkOpen, setIsLinkOpen] = useState(false);

    if (!editor) return null;

    const handleOpenLinkPopover = () => {
        const { from, to } = editor.state.selection;
        const isTextSelected = from !== to;
        const previousUrl = editor.getAttributes('link').href || "";

        if (isTextSelected) {
            const selectedText = editor.state.doc.textBetween(from, to);
            setLinkData({ url: previousUrl, text: selectedText });
        } else {
            setLinkData({ url: "", text: "" });
        }
        setIsLinkOpen(true);
    };

    const confirmLink = () => {
        const { from, to } = editor.state.selection;
        const isTextSelected = from !== to;

        if (linkData.url === "") {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            if (isTextSelected) {
                // Kasus 1: Teks sudah ada, tinggal kasih link
                editor.chain().focus().extendMarkRange('link').setLink({ href: linkData.url }).run();
            } else {
                // Kasus 2: Teks kosong, buat teks + link baru
                const linkText = linkData.text || linkData.url;
                editor.chain()
                    .focus()
                    .insertContent(`<a href="${linkData.url}">${linkText}</a>`)
                    .run();
            }
        }
        setIsLinkOpen(false);
    };

    const buttons = [
        { icon: Heading01Icon, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: 'heading', options: { level: 1 } },
        { icon: Heading02Icon, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: 'heading', options: { level: 2 } },
        { icon: TextBoldIcon, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
        { icon: TextItalicIcon, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
        { icon: TextUnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline' },
        { icon: ListViewIcon, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
        { icon: ListNumberIcon, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
        { icon: QuoteIcon, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote' },
        { icon: SmileIcon, action: () => editor.chain().focus().insertContent(":").run(), active: 'emoji-trigger' },
    ];

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
            {buttons.map((btn, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={btn.action}
                    className={`p-2 rounded-lg transition-all ${editor.isActive(btn.active, btn.options || {})
                        ? "bg-[#002558] text-white shadow-md"
                        : "text-slate-500 hover:bg-slate-200"
                        }`}
                >
                    <HugeiconsIcon icon={btn.icon} size={18} />
                </button>
            ))}

            <Popover open={isLinkOpen} onOpenChange={setIsLinkOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        onClick={handleOpenLinkPopover}
                        className={`p-2 rounded-lg transition-all ${editor.isActive('link')
                            ? "bg-[#002558] text-white shadow-md"
                            : "text-slate-500 hover:bg-slate-200"
                            }`}
                    >
                        <HugeiconsIcon icon={Link01Icon} size={18} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-5 rounded-[2rem] shadow-2xl border-none space-y-4" align="start">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#002558]">
                            <HugeiconsIcon icon={Link01Icon} size={18} />
                            <h4 className="text-xs font-black uppercase tracking-widest">Tambah Link</h4>
                        </div>

                        {editor.state.selection.from === editor.state.selection.to && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Teks Tampilan</label>
                                <Input
                                    value={linkData.text}
                                    onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                                    placeholder="Contoh: Klik di sini"
                                    className="h-10 rounded-xl focus-visible:ring-blue-500"
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">URL Tujuan</label>
                            <Input
                                value={linkData.url}
                                onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                                placeholder="https://example.com"
                                className="h-10 rounded-xl focus-visible:ring-blue-500"
                                onKeyDown={(e) => e.key === 'Enter' && confirmLink()}
                            />
                        </div>

                        <Button
                            onClick={confirmLink}
                            className="w-full bg-[#002558] hover:bg-slate-800 rounded-xl font-bold h-10 gap-2 transition-all active:scale-95"
                        >
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                            Terapkan
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

interface BaseEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    placeholder?: string;
}

const BaseTextEditor = ({ value, onChange, error, placeholder }: BaseEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Emoji.configure({
                emojis: gitHubEmojis,
                enableEmoticons: true,
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer hover:text-blue-800 transition-all',
                },
            }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "tiptap focus:outline-none max-w-none min-h-[200px] p-6 text-slate-700 font-medium",
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "");
        }
        console.log(editor?.getHTML());
    }, [value, editor]);

    return (
        <div className={`group transition-all border-2 rounded-[2rem] overflow-hidden bg-white ${error ? "border-red-500 ring-4 ring-red-50" : "border-slate-100 focus-within:border-blue-500"
            }`}>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} placeholder={placeholder} />

            {error && (
                <div className="px-4 py-2 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest border-t border-red-100">
                    {error}
                </div>
            )}
        </div>
    );
};

const BaseTextEditorWithValidation = ({ name, label, placeholder }: Props) => {
    const { control } = useFormContext();

    return (
        <div className="space-y-3">
            {label && (
                <label className="text-sm font-black text-[#002558] uppercase tracking-tighter">
                    {label}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <BaseTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        placeholder={placeholder}
                    />
                )}
            />
        </div>
    );
};

const RichTextEditor = (props: Props) => {
    if (props.withValidation) {
        return <BaseTextEditorWithValidation {...props} />;
    }

    return (
        <div className="space-y-3">
            {props.label && (
                <label className="text-sm uppercase tracking-tighter">
                    {props.label}
                </label>
            )}
            <BaseTextEditor
                value={props.value}
                onChange={props.onChange}
                error={props.error}
                placeholder={props.placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
import sanitizeHtml from 'sanitize-html';

interface Props {
    html: string;
    className?: string;
}

export default function HTMLRenderer({ html, className }: Props) {
    const sanitizedHtml = sanitizeHtml(html);

    return (
        <div
            className={`tiptap prose prose-slate max-w-none prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6 prose-li:my-1
        ${className}`}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
}
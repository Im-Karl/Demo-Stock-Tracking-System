import React from 'react';
import ReactMarkdown from 'react-markdown';
import Button from '../base-ui/Button';
import { RiCloseFill } from 'react-icons/ri';

const markdownHelpContent = `
## Tiêu đề (Heading)

Markdown sử dụng dấu # để tạo tiêu đề.

# Tiêu đề cấp 1
## Tiêu đề cấp 2
### Tiêu đề cấp 3
#### Tiêu đề cấp 4

  





---




  

## Định dạng chữ

**Chữ in đậm**  
*Chữ in nghiêng*  
***Vừa đậm vừa nghiêng***  
~~Chữ bị gạch ngang~~





---





## Đoạn văn

Đây là đoạn văn thứ nhất.

Đây là đoạn văn thứ hai.





---





## Danh sách

### Không thứ tự
- Mục 1
- Mục 2
  - Mục con

### Có thứ tự
1. Mục một
2. Mục hai
3. Mục ba







---







## Liên kết

[Tên hiển thị](https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1)

Ví dụ:  
[Google](https://google.com)






---





## Hình ảnh

![Mô tả ảnh](link_hình_ảnh)




---




## Trích dẫn

> Đây là nội dung trích dẫn  
>> Trích dẫn lồng nhau




---



## Code

Code ngắn: \`print("Hello")\`

Code nhiều dòng:
\`\`\`python
def hello():
    print("Hello world")
\`\`\`



---



## Bảng

| Tên | Tuổi | Nghề |
|-----|------|------|
| An  | 20   | SV   |
| Bình| 25   | Dev  |



---



## Checklist

- [x] Việc đã hoàn thành
- [ ] Việc chưa làm


---



## Đường kẻ ngang






---


`;

export default function MarkdownHelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl h-[80vh] rounded-2xl bg-white/80 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200"
      >
        {/*  Nút Close bằng Base UI */}
        <div className="absolute top-4 right-4 z-10">
          <Button intent="neutral" size="icon" className="!rounded-full" onClick={onClose}>
            <RiCloseFill size={20} />
          </Button>
        </div>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-extrabold text-neutral-800 dark:text-neutral-100">Hướng dẫn sử dụng Markdown</h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Markdown source */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-bold uppercase mb-2 text-neutral-500 dark:text-neutral-400">
                Markdown
              </label>
              <textarea
                readOnly
                value={markdownHelpContent}
                className="flex-1 w-full p-4 rounded-xl resize-none font-mono text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 custom-scrollbar"
              />
            </div>

            {/* Preview */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-bold uppercase mb-2 text-neutral-500 dark:text-neutral-400">Preview</label>
              <div className="flex-1 w-full p-5 rounded-xl overflow-y-auto bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 prose prose-lg max-w-none prose-neutral dark:prose-invert custom-scrollbar">
                <ReactMarkdown>{markdownHelpContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

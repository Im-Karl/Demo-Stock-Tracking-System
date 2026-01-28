import React from "react";
import ReactMarkdown from "react-markdown";

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
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-6xl h-[80vh]
          rounded-2xl
          bg-white/70 dark:bg-slate-800/70
          backdrop-blur-xl
          border border-slate-200 dark:border-slate-700
          shadow-2xl
          flex flex-col
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            text-slate-400 hover:text-slate-600
            dark:text-slate-400 dark:hover:text-slate-200
            text-2xl cursor-pointer
          "
        >
          ✕
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Hướng dẫn sử dụng Markdown
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">

            {/* Markdown source */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-bold uppercase mb-2
                                text-slate-500 dark:text-slate-400">
                Markdown
              </label>
              <textarea
                readOnly
                value={markdownHelpContent}
                className="
                  flex-1 w-full p-4 rounded-xl resize-none
                  font-mono text-sm
                  bg-slate-50 dark:bg-slate-900
                  border border-slate-300 dark:border-slate-600
                  text-slate-800 dark:text-slate-100
                  overflow-hidden 
                "
              />
            </div>

            {/* Preview */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-bold uppercase mb-2
                                text-slate-500 dark:text-slate-400">
                Preview
              </label>

              <div
                className="
                  flex-1 w-full p-5 rounded-xl overflow-y-auto
                  bg-slate-50 dark:bg-slate-900
                  border border-slate-300 dark:border-slate-600
                  prose prose-lg max-w-none
                  prose-slate dark:prose-invert
                  prose-headings:text-slate-800 dark:prose-headings:text-slate-100
                  prose-p:text-slate-700 dark:prose-p:text-slate-300
                  prose-a:text-blue-600 dark:prose-a:text-blue-400
                "
              >
                <ReactMarkdown>{markdownHelpContent}</ReactMarkdown>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
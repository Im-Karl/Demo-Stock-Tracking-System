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
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl h-[80vh] rounded-xl shadow-xl border-2 border-gray-300 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
        >
          ✕
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <h2 className="text-2xl font-bold">
            Hướng dẫn sử dụng Markdown 
          </h2>
        </div>

        {/* Body (SCROLL Ở ĐÂY) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            
            {/* Markdown */}
            <div className="flex flex-col h-full">
              <label className="text-sm font-bold text-gray-500 mb-2 uppercase">
                Markdown
              </label>
              <textarea
                readOnly
                value={markdownHelpContent}
                className="flex-1 w-full p-4 border rounded-lg font-mono text-sm bg-gray-50 resize-none"
              />
            </div>

            {/* Preview */}
            <div className="flex flex-col h-full">
              <label className="text-sm font-bold text-gray-500 mb-2 uppercase">
                Preview
              </label>
              <div className="flex-1 w-full border rounded-lg p-4 overflow-y-auto prose prose-blue max-w-none bg-white">
                <ReactMarkdown>{markdownHelpContent}</ReactMarkdown>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Modal from '../base-ui/Modal';

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hướng dẫn sử dụng Markdown"
      maxWidth="max-w-6xl"
      className="h-[80vh]"
    >
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Markdown source */}
          <div className="flex flex-col h-full">
            <label className="text-xs font-bold uppercase mb-2 text-grey-500">Markdown</label>
            <textarea
              readOnly
              value={markdownHelpContent}
              className="flex-1 w-full p-4 rounded-xl resize-none font-mono text-sm bg-grey-50 dark:bg-grey-900/40 border-none text-grey-800 dark:text-grey-200 custom-scrollbar outline-none"
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col h-full">
            <label className="text-xs font-bold uppercase mb-2 text-grey-500">Preview</label>
            <div className="flex-1 w-full p-5 rounded-xl overflow-y-auto bg-grey-50 dark:bg-grey-900/40 border-none prose prose-lg max-w-none prose-neutral dark:prose-invert custom-scrollbar">
              <ReactMarkdown>{markdownHelpContent}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

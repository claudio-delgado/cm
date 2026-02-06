export class ModalBox{
    constructor(container_id = "modalPopup") {
        let container_div = document.createElement("div")
        container_div.id = container_id
        container_div.setAttribute("tab-index", "-1")
        container_div.classList.add("hidden", "fixed", "inset-0", "z-50", "flex", "justify-center", "items-center", "overflow-y-auto", "overflow-x-hidden", "w-full", "h-screen", "bg-gray-900/25")
        this.container = container_div
        let first_level = document.createElement("div")
        first_level.classList.add("relative", "px-3", "mx-0", "w-full")
        let second_level = document.createElement("div")
        second_level.classList.add("relative", "bg-white", "rounded-lg", "shadow-sm", "dark:bg-gray-700")
        first_level.appendChild(second_level)
        this.container.appendChild(first_level)
        let header = document.createElement("div")
        header.id = "modalBoxHeader"
        header.classList.add("flex", "items-center", "justify-between", "p-4", "md:p-5", "border-b", "rounded-t", "dark:border-gray-600", "border-gray-200")
        let h3 = document.createElement("h3")
        h3.id = "modalBoxTitle"
        h3.setAttribute("data-i18n", "")
        h3.classList.add("text-xl", "font-semibold", "text-gray-900", "dark:text-white")
        header.appendChild(h3)
        let button = document.createElement("button")
        button.setAttribute("type", "button")
        button.setAttribute("data-modal-hide", this.container.id)
        button.classList.add("text-gray-400", "bg-transparent", "hover:bg-gray-200", "hover:text-gray-900", "rounded-lg", "text-sm", "w-8", "h-8", "ms-auto", "inline-flex", "justify-center", "items-center", "dark:hover:bg-gray-600", "dark:hover:text-white")
        button.innerHTML = "<svg class='w-3 h-3' aria-hidden'tru' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'></svg><path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'/>"
        let span = document.createElement("span")
        span.classList.add("sr-only")
        span.innerText = "Close modal"
        button.appendChild(span)
        header.appendChild(button)
        second_level.appendChild(header)
        let body = document.createElement("div")
        body.id = "modalBoxBody"
        body.classList.add("p-4")
        second_level.appendChild(body)
        let footer = document.createElement("div")
        footer.id = "modalBoxFooter"
        footer.classList.add("flex", "items-center", "gap-2", "p-4", "md:p-5", "border-t", "border-gray-200", "rounded-b", "dark:border-gray-600")
        let button1 = document.createElement("button")
        button1.id = "modalBoxFooterButton1"
        button1.setAttribute("type", "button")
        button1.setAttribute("data-i18n", "")
        button1.setAttribute("data-modal-hide", this.container.id)
        button1.classList.add("text-white", "bg-blue-700", "hover:bg-blue-800", "focus:ring-4", "focus:outline-none", "focus:ring-blue-300", "font-medium", "rounded-lg", "text-sm", "px-5", "py-2.5", "text-center", "dark:bg-blue-600", "dark:hover:bg-blue-700", "dark:focus:ring-blue-800")
        let button2 = document.createElement("button")
        button2.id = "modalBoxFooterButton2"
        button2.setAttribute("type", "button")
        button2.setAttribute("data-i18n", "")
        button2.setAttribute("data-modal-hide", this.container.id)
        button2.classList.add("text-white", "bg-blue-700", "hover:bg-blue-800", "focus:ring-4", "focus:outline-none", "focus:ring-blue-300", "font-medium", "rounded-lg", "text-sm", "px-5", "py-2.5", "text-center", "dark:bg-blue-600", "dark:hover:bg-blue-700", "dark:focus:ring-blue-800")
        footer.appendChild(button1)
        footer.appendChild(button2)
        second_level.appendChild(footer)
        this.container.appendChild(first_level)
    }
    build = () => {
        document.body.appendChild(this.container)
    }
    show = () => {
        document.getElementById(this.container.id).classList.remove("hidden")
    }
    hide = () => {
        document.getElementById(this.container.id).classList.add("hidden")
    }
    progress_modal = (title_text = "Warning!", data = false) => {
        let title = document.getElementById("modalBoxTitle")
        let body = document.getElementById("modalBoxBody")
        title.innerHTML= translate(language, title_text)
        title.classList.remove("text-base")
        title.classList.add("text-xl")
        title.parentElement.classList.remove("text-base", "py-2", "ps-4", "p-4")
        title.parentElement.classList.add("text-xl", "p-4")
        body.classList.remove("py-1", "px-4", "p-4")
        body.classList.add("p-4")
        body.innerHTML = ""
        let p = new element("p", "text-base py-2 text-gray-400", [{"key":"data-i18n","value":""}], body)
        if(data && data.paragraphs && data.paragraphs.length){
            data.paragraphs.forEach((paragraph_text) => {
                p.create(); p.appendContent(translate(language, paragraph_text))
            })
        } else {
            p.create(); p.appendContent(translate(language, "You are about to change all life progress in your colony!"))
            p.create(); p.appendContent(translate(language, "This means that if the file is uploaded succesfully, all last progress will be replaced by the one described in your file."))
            p.create(); p.appendContent(translate(language, "If you are decided to update your progress choose 'Ok', otherwise choose 'Cancel'."))
        }
        if(!data || data.buttons == undefined || data.buttons == null){
            document.getElementById("modalBoxFooterButton1").innerText = translate(language, "Ok")
            document.getElementById("modalBoxFooterButton2").innerText = translate(language, "Cancel")
        } else {
            document.getElementById("modalBoxFooterButton1").innerText = translate(language, data.button1)
            document.getElementById("modalBoxFooterButton2").innerText = translate(language, data.button2)
        }
    }
}
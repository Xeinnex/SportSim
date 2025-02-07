export function Button({children, customProperty}){
    return (
        <div className={`b-2 border-spacing-6 ${customProperty ? "bg-black" : "bg-white"} ${customProperty ? "text-white" : "text-black"}`}>
          {children}
        </div>
    )
}
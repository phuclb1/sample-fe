const Section = ({ children, className, id = "FS" }) => {
    return <div className={`fs-section ${className}`} id={id}>
        {children}
    </div>
}
export default Section;
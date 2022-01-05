const Flex = ({ children, className, flexDirection = "row", alignItem = "start", justifyContent = 'start', flexWrap,...props }) => {
    return <div className={`d-flex ${flexDirection === 'column' ? 'flex-column' : 'flex-row'} ${alignItem ? 'align-items-' + alignItem : ''} ${justifyContent ? 'justify-content-' + justifyContent : ''} ${flexWrap ? 'flex-wrap' : ''} ${className}`} {...props}>
        {children}
    </div>
}
export default Flex;
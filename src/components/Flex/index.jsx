const Flex = ({ children, className, flexDirection = "row", alignItem = "start", justifyContent = 'start', flexWrap }) => {
    return <div className={`d-flex ${flexDirection === 'column' ? 'flex-column' : 'flex-row'} ${alignItem ? 'align-items-' + alignItem : ''} ${justifyContent ? 'justify-content-' + justifyContent : ''} ${flexWrap ? 'flex-wrap' : ''} ${className}`}>
        {children}
    </div>
}
export default Flex;
import SectionTag from "./SectionTag";

const SectionTitle = ({ tag, title, description }) => {
    return <div className="fs-section-title">
        {tag && <SectionTag text={tag} />}
        <h3 className="title extra" dangerouslySetInnerHTML={{ __html: title }}></h3>
        <p dangerouslySetInnerHTML={{ __html: description }}></p>
    </div>
}
export default SectionTitle;
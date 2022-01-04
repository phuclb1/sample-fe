import React, { useEffect, useState } from "react";
import NxtPageHeader from "../../../components/NxtPageHeader";
import { Table, Button, Card, Tooltip, Radio } from 'antd';
import { Link } from "react-router-dom";
import { ITEMS_PER_PAGE, ROUTES } from "../../../constants/app";
import { history } from "../../../router/history";
import swal from "sweetalert";
import API from "../../../services/API";
import { toast } from "react-toastify";
import { Row, Col } from 'react-bootstrap';
import { MESSAGES } from "../../../constants/message";
import FaceItem from "./components/FaceItem";
import ReactPaginate from 'react-paginate';

const ManageFacePage = () => {
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [isCardView, setIsCardView] = useState(true);
    const [totalPageCount, setTotalPageCount] = useState(0);

    useEffect(() => {
        loadFacesData(pageIndex);
    }, [])

    const loadFacesData = async (pageIndex) => {
        setLoading(true);
        try {
            const res = await API.face.search({
                page: pageIndex,
                pagesize: ITEMS_PER_PAGE
            });
            setTotalItems(res.total || 0);
            const total = res?.total % ITEMS_PER_PAGE === 0 ? res?.total / ITEMS_PER_PAGE : (parseInt(res?.total / ITEMS_PER_PAGE) + 1);
            setTotalPageCount(total);
            setDataSource(res.data);
            setLoading(false);
        } catch (err) {
            setTotalItems(0);
            setDataSource([]);
            setLoading(false);
            setTotalPageCount(0);
        }
    }
    const columns = [
        {
            title: 'Image',
            dataIndex: 'root_image',
            width: 60,
            render: text => {
                return <div className="td-image">
                    <img src={API.customer.getResource(text)} />
                </div>
            }
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Code',
            dataIndex: 'code'
        },
        {
            title: 'Description',
            dataIndex: 'description'
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            width: 150,
            className: 'text-center',
            render: (text, item) => {
                return <div className="text-center text-nowrap">
                    <Tooltip title="Edit">
                        <Link className="ant-btn ant-btn-primary ant-btn-round ml-2" to={`${ROUTES.FACES}/edit/${item.id}`}>
                            <i className="far fa-edit"></i>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button shape="round" type="danger" className="ml-2" onClick={(e) => handleDelete(e, item.id)}>
                            <i className="far fa-trash-alt"></i>
                        </Button>
                    </Tooltip>
                </div>
            }
        },
    ];

    const onChange = (pagination) => {
        setPageIndex(pagination.current);
        loadFacesData(pagination.current);
    }

    const handleAddNewClick = () => {
        history.push(`${ROUTES.FACES}/add-new`);
    }

    const handleDelete = (e, id) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!id) return;
        swal({
            text: "Are you sure you want to delete this item?",
            buttons: {
                cancel: {
                    text: "No",
                    className: "btn btn-dark px-3",
                    closeModal: true,
                    visible: true
                },
                confirm: {
                    text: "Yes",
                    className: "btn btn-danger px-3"
                }
            },
        }).then((willDelete) => {
            if (willDelete) {
                deleteFace(id);
            }
        });
    }

    // Call api to remove item
    const deleteFace = async (id) => {
        const res = await API.face.deleteById(id);
        toast.success(MESSAGES.RemoveSuccess);
        loadFacesData(pageIndex);
    }

    const handleItemClick = (id) => {
        history.push(`${ROUTES.FACES}/edit/${id}`)
    }
    return <div className="ne-page-body ne-page-faces">
        <NxtPageHeader
            title="Face Management"
            icon="fas fa-expand"
            breadcrumb="Faces"
        />
        <Card>
            <Row className="mb-3">
                <Col md="6" sm="6" xs="6">
                    <Button type="primary" onClick={handleAddNewClick}>
                        <i className="mr-1 fas fa-plus"></i>
                        <span>Add new</span>
                    </Button>
                </Col>
                <Col md="6" sm="6" xs="6" className="text-right">
                    <div className="d-flex justify-content-end" style={{ height: '32px' }}>
                        <Radio.Group value={isCardView} onChange={(e) => setIsCardView(e.target.value)}>
                            <Radio.Button value={true}><i className="fas fa-th"></i></Radio.Button>
                            <Radio.Button value={false}><i className="fas fa-list"></i></Radio.Button>
                        </Radio.Group>
                    </div>
                </Col>
            </Row>
            {!isCardView ? <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                onChange={onChange}
                pagination={{ pageSize: ITEMS_PER_PAGE, total: totalItems }}
                rowKey={record => record.id} /> : <>
                <Row className="mt-5">
                    {dataSource?.map((item, idx) => {
                        return <Col lg="2" md="3" sm="4" xs="6" key={idx}>
                            <div className="position-relative">
                                <Tooltip placement="right" title="Delete">
                                    <Button size="small" shape="circle" type="danger" className="face-item-remove" onClick={(e) => handleDelete(e, item.id)}>
                                        <i className="far fa-trash-alt"></i>
                                    </Button>
                                </Tooltip>
                                <Tooltip placement="right" title="Edit">
                                    <Link size="small" className="ant-btn ant-btn-primary ant-btn-circle ant-btn-sm face-item-edit" to={`${ROUTES.FACES}/edit/${item.id}`}>
                                        <i className="far fa-edit"></i>
                                    </Link>
                                </Tooltip>
                                <FaceItem onClick={() => handleItemClick(item.id)} image={API.customer.getResource(item.root_image)} name={item.name} description={item.description} bbox={item.bbox} />
                            </div>
                        </Col>
                    })}
                </Row>

                <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={totalPageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(e) => {
                        setPageIndex(e.selected + 1);
                        loadFacesData(e.selected + 1);
                    }}
                    previousClassName="ant-pagination-prev"
                    previousLinkClassName="ant-pagination-item-link"
                    nextLinkClassName="ant-pagination-item-link"
                    nextClassName="ant-pagination-next"
                    disabledClassName="ant-pagination-disabled"
                    pageClassName="ant-pagination-item"
                    containerClassName={'ant-pagination ant-table-pagination ant-table-pagination-right'}
                    activeClassName={'ant-pagination-item-active'}
                />
            </>}
        </Card>
    </div>
}

export default ManageFacePage;
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
import VoiceItem from "./components/VoiceItem";
import ReactPaginate from 'react-paginate';

const ManageVoicePage = () => {
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [isCardView, setIsCardView] = useState(false);
    const [totalPageCount, setTotalPageCount] = useState(0);

    useEffect(() => {
        loadVoicesData(pageIndex);
    }, [])

    const loadVoicesData = async (pageIndex) => {
        setLoading(true);
        try {
            const res = await API.voice.search({
                page: pageIndex,
                pagesize: ITEMS_PER_PAGE
            });
            setTotalItems(res.total || 0);
            setDataSource(res.data);
            const total = res?.total % ITEMS_PER_PAGE === 0 ? res?.total / ITEMS_PER_PAGE : (parseInt(res?.total / ITEMS_PER_PAGE) + 1);
            setTotalPageCount(total);
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
            title: 'No.',
            dataIndex: 'id',
            render: (text, item, index) => {
                return index + 1;
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
            title: 'Actions',
            dataIndex: 'id',
            width: 150,
            className: 'text-center',
            render: (text, item) => {
                return <div className="text-center text-nowrap">
                    <Tooltip title="Edit">
                        <Link className="ant-btn ant-btn-primary ant-btn-round ml-2" to={`${ROUTES.VOICES}/edit/${item.id}`}>
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
        loadVoicesData(pagination.current);
    }

    const handleAddNewClick = () => {
        history.push(`${ROUTES.VOICES}/add-new`);
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
                deleteVoice(id);
            }
        });
    }

    // Call api to remove item
    const deleteVoice = async (id) => {
        const res = await API.voice.deleteById(id);
        toast.success(MESSAGES.RemoveSuccess);
        loadVoicesData(pageIndex);
    }

    const handleItemClick = (id) => {
        history.push(`${ROUTES.VOICES}/edit/${id}`)
    }
    return <div className="ne-page-body ne-page-voices">
        <NxtPageHeader
            title="Voice Management"
            icon="far fa-file-audio"
            breadcrumb="Voices"
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
                        return <Col lg="4" md="4" key={idx}>
                            <VoiceItem onClick={() => handleItemClick(item.id)} onDelete={handleDelete} data={item} />
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
                        loadVoicesData(e.selected + 1);
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
            </>
            }
        </Card>
    </div>
}

export default ManageVoicePage;
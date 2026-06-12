import { Button, Col, Form, Input, Row } from 'antd'
import UploadSingleFile from 'common/components/upload/UploadComponent'
import { CommonStatus, TEXT_CONSTANTS } from 'common/constants/constants'
import { openNotification, openNotificationError } from 'common/utils'
import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useLocation, useNavigate } from 'react-router'
import { blogServices } from '../BlogApis'
import RadiusSelection from 'common/components/select/RadiusSelection'
import { ADMIN_PATH } from 'common/constants/paths'

function AddEditBlogPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const location = useLocation()
  const { state } = location || {}
  const record = state?.record || {}
  const [content, setContent] = useState(record?.content || '')

  useEffect(() => {
    if (record?.content) {
      setContent(record.content)
    }
  }, [record])

  const initialValues = {
    title: record?.title,
    blog_photo: record?.blog_photo,
    content: record?.content,
    status: record?.status
  }

  const handleSubmit = async (value: any) => {
    try {
      const payLoadAccount = {
        id: record?.id,
        title: value?.title,
        content: value?.content,
        blog_photo: value?.blog_photo,
        status: value?.status?.toString()
      }

      let res

      try {
        if (record.id) {
          res = await blogServices.put(payLoadAccount)
        } else {
          res = await blogServices.post(payLoadAccount)
        }

        if (res.status == 1) {
          if (record.id) {
            console.log('🚀 ~ handleSubmit ~ record:', record)
            openNotification('success', 'Thành công', 'Cập nhật thành công')
            navigate(ADMIN_PATH.BLOG)
          } else {
            openNotification('success', 'Thành công', 'Thêm mới thành công')
            navigate(ADMIN_PATH.BLOG)
          }
        }
      } catch (error) {
        openNotificationError(error)
      }
    } catch (error) {
      openNotificationError(error)
    }
  }

  return (
    <>
      <Form
        form={form}
        name='addAddEditProduct'
        labelAlign='left'
        scrollToFirstError
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name='title'
              label='Tiêu đề bài viết'
              rules={[
                {
                  required: true,
                  message: `Tiêu đề: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          {record.id && (
            <Col span={12}>
              <Form.Item
                label=' Trạng thái'
                name='status'
                rules={[
                  {
                    required: true,
                    message: 'Trạng thái hoạt động: Bắt buộc chọn'
                  }
                ]}
              >
                <RadiusSelection
                  onChange={() => {}}
                  defaultValue={CommonStatus.ACTIVE.toString()}
                  options={[
                    { value: CommonStatus.ACTIVE.toString(), text: 'Hoạt động' },
                    { value: CommonStatus.INACTIVE.toString(), text: 'Ngừng hoạt động' }
                  ]}
                  placeholder='Trạng thái'
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name='blog_photo'
              label='Ảnh sản phẩm'
              rules={[
                {
                  required: true,
                  message: `Ảnh slide: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
                }
              ]}
            >
              <UploadSingleFile
                initialImage={record?.blog_photo}
                onSuccessUpload={(imageUrl) => {
                  form.setFieldsValue({ blog_photo: imageUrl })
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name={'content'} label={'Nội dung bài viết'}>
              <ReactQuill
                value={content}
                placeholder='Nhập mô tả bài viết'
                theme='snow'
                className='h-[350px]'
                onChange={(value) => {
                  console.log('🚀 ~ AddEditBlogPage ~ value:', value)
                  form.setFieldsValue({ content: value })
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} className='mt-10'>
          <Col span={12}> </Col>
          <Col span={12} className='flex items-center justify-end'>
            <Button
              danger
              onClick={() => {
                navigate('/ad-blog')
              }}
            >
              Thoát
            </Button>
            <Button htmlType='submit' className='btn-confirm' style={{ marginLeft: '10px' }}>
              Xác nhận
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default AddEditBlogPage

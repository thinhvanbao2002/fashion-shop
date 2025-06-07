import { Button, Col, Form, Input, Row } from 'antd'
import RadiusSelection from 'common/components/select/RadiusSelection'
import { TEXT_CONSTANTS } from 'common/constants/constants'
import { categoryServices } from 'features/admin/Category/CategoryApis'
import { useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ProductTypes } from '../constants/product.constants'
import UploadSingleFile from 'common/components/upload/UploadComponent'
import UploadMultipart from 'common/components/upload/UploadMultipartComponent'
import Config from 'common/constants/config'
import { useLocation } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import { openNotification } from 'common/utils'
import { productServices } from '../ProductApis'
import { IProduct } from '../Product.props'
import { useNavigate } from 'react-router-dom'
import TextArea from 'antd/es/input/TextArea'
import { ADMIN_PATH } from 'common/constants/paths'

const AddEditProduct = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [payload, setPayload] = useState<any>({
    q: '',
    limit: 5
  })
  const [categoryListOptions, setCategoryListOptions] = useState<any>([])
  const [images, setImages] = useState<Array<any>>([])
  const location = useLocation()
  const { state } = location || {}
  const record = state?.record || {}
  console.log('🚀 ~ AddEditProduct ~ record:', record)

  const initialValues = {
    name: record?.name,
    category_id: record?.category_id,
    product_type: record?.product_type,
    product_code: record?.product_code,
    price: record?.price,
    quantity: record?.quantity,
    image: record?.image,
    description: record?.description,
    introduce: record?.introduce
  }

  useEffect(() => {
    if (record && record.product_photo && record.product_photo.length) {
      const convertProductPhoto = record?.product_photo.map((p: any) => {
        return {
          uid: uuidv4(),
          name: uuidv4(),
          url: p?.url
        }
      })
      setImages(convertProductPhoto)
      form.setFieldsValue({ product_photo: convertProductPhoto })
    }
  }, [])

  const onChangeSearchCategory = async (value: any) => {
    setPayload({
      q: value
    })
  }

  const handleGetCategoryListOptions = async (payload: any) => {
    try {
      const res = await categoryServices.get(payload)
      setCategoryListOptions(
        res.data.map((item: any) => {
          return {
            text: item?.name,
            value: item?.id
          }
        })
      )
    } catch (error) {
      console.log('🚀 ~ handleGetCategoryListOptions ~ error:', error)
    }
  }

  useEffect(() => {
    handleGetCategoryListOptions(payload)
    // setImages(defaultFile)
    // form.setFieldsValue({ images: defaultFile })
  }, [payload])

  const handleSubmit = async (value: IProduct) => {
    const payLoadAccount = {
      id: record?.id,
      name: value?.name,
      category_id: value?.category_id,
      price: value?.price,
      product_type: value?.product_type,
      quantity: Number(value?.quantity),
      description: value?.description,
      image: value?.image,
      product_photo: value?.product_photo,
      introduce: value?.introduce,
      product_code: value?.product_code
    }
    console.log('🚀 ~ handleSubmit ~ payLoadAccount:', payLoadAccount)
    let res
    try {
      if (record.id) {
        res = await productServices.put(payLoadAccount)
      } else {
        res = await productServices.post(payLoadAccount)
      }
      if (res.status == 1) {
        if (record.id) {
          openNotification('success', 'Thành công', 'Cập nhật thành công')
          navigate(`${ADMIN_PATH.PRODUCT}`)
        } else {
          openNotification('success', 'Thành công', 'Thêm mới thành công')
          navigate(`${ADMIN_PATH.PRODUCT}`)
        }
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
  }

  return (
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
          <Form.Item name='product_code' label='Mã sản phẩm'>
            <Input disabled placeholder='Mã sản phẩm tự động tạo' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='name'
            label='Tên sản phẩm'
            rules={[
              {
                required: true,
                message: `Tên sản phẩm: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            name={'category_id'}
            label={'Danh mục'}
            rules={[
              {
                required: true,
                message: `Danh mục: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <RadiusSelection
              showSearch={true}
              onSearch={(e) => onChangeSearchCategory(e)}
              placeholder={'Danh mục'}
              options={categoryListOptions}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col md={8}>
          <Form.Item
            name={'product_type'}
            label={'Loại hàng'}
            rules={[
              {
                required: true,
                message: `Loại hàng: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <RadiusSelection
              placeholder={'Trạng thái hoạt động'}
              // onChange={(value: number) => {
              //   let tmpValue
              //   value === undefined ? (tmpValue = null) : (tmpValue = value)
              //   onChangeValue({ product_type: tmpValue })
              // }}
              options={[
                { value: ProductTypes.BEST_SELLING, text: 'Hàng bán chạy' },
                { value: ProductTypes.INVENTORY, text: 'Hàng tồn kho' },
                { value: ProductTypes.NEW_PRODUCT, text: 'Hàng mới về' }
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='price'
            label='Giá tiền'
            rules={[
              {
                required: true,
                message: `Giá tiền: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              },
              {
                pattern: Config._reg.number,
                message: `Giá tiền: Phải là số`
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* <Col span={8}>
          <Form.Item name='quantity' label='Số lượng'>
            <Input />
          </Form.Item>
        </Col> */}
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item
            name='image'
            label='Ảnh sản phẩm'
            rules={[
              {
                required: true,
                message: `Ảnh sản phẩm: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <UploadSingleFile
              width='200px'
              height='250px'
              initialImage={record?.image}
              onSuccessUpload={(imageUrl) => {
                form.setFieldsValue({ image: imageUrl })
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12} className='pl-[12px]'>
          <Form.Item name='product_photo' label='Ảnh chi tiết sản phẩm'>
            <UploadMultipart
              defaultFileList={images}
              onFileListChange={(images) => {
                const standardizationImage = images.map((item: any) => {
                  if (item?.response?.url) {
                    return {
                      uid: item?.uid,
                      name: item?.name,
                      url: item?.response.url
                    }
                  }
                  return {
                    uid: item?.uid,
                    name: item?.name,
                    url: item.url
                  }
                })
                form.setFieldsValue({ product_photo: standardizationImage })
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name='introduce' label='Giới thiệu sản phẩm'>
            <TextArea rows={4} placeholder='Nhập giới thiệu về sản phẩm' maxLength={2000} />
          </Form.Item>
        </Col>
      </Row>
      {/* <Row gutter={24}>
        <Col span={24}>
          <Form.Item name={'description'} label={'Mô tả sản phẩm'}>
            <ReactQuill placeholder='Nhập mô tả sản phẩm' theme='snow' className='h-[350px]' />
          </Form.Item>
        </Col>
      </Row> */}
      <Row gutter={24} className='mt-10'>
        <Col span={12}> </Col>
        <Col span={12} className='flex items-center justify-end'>
          <Button
            danger
            onClick={() => {
              navigate('/ad-product')
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
  )
}

export default AddEditProduct

<template>
  <el-dialog
    v-el-drag-dialog
    :title="textMap[dialogStatus]"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @dragDialog="handleDrag"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="100px"
      style="margin-left:10px; margin-right:30px;"
      :width="DLG_WIDTH"
    >
      <el-row>
        <el-col :span="16">
          <el-form-item label="企业名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="企业名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="英文缩写" prop="abbr">
            <el-input
              v-model="dataForm.abbr"
              maxlength="6"
              show-word-limit
              placeholder="英文缩写"
              @change="abbrChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="统一代码" prop="uscc">
          <el-input
            v-model="dataForm.uscc"
            placeholder="企业社会统一信用代码"
          />
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="企业类型" prop="type" required>
          <el-radio-group v-model="dataForm.type">
            <el-radio
              v-for="item in entTypes"
              :key="item.key"
              :label="item.key"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="所属行业" prop="industry">
          <tree-input
            ref="industryTreeInput"
            v-model="dataForm.industry"
            :get-children="getIndustryTreeData"
            :get-my-info="getMyInfo"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="所属地区" prop="region">
          <dynamicCascader
            v-model="dataForm.region"
            :placeholder="'请选择所属地区'"
            :cascader-props="{ label: 'name', value: 'id' }"
            :value-props="['province', 'city', 'districCounty']"
            :query-data-method="queryRegion"
          />
        </el-form-item>
      </el-row>

      <!-- <el-row>
        <el-form-item label="多级选择">
          <multiSelect
            :option-props="{ label: 'name', value: 'id' }"
            :query-data-method="queryRegion"
          />
        </el-form-item>
      </el-row> -->

      <el-row>
        <el-col :span="16">
          <el-form-item label="企业地址" prop="address" required>
            <el-input v-model="dataForm.address" placeholder="企业地址" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="60px" label="邮编" prop="zipCode">
            <el-input v-model="dataForm.zipCode" placeholder="邮编" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="企业联系人" prop="mainPerson">
            <el-input v-model="dataForm.mainPerson" placeholder="联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="60px" label="电话" prop="mainPersonMobile">
            <el-input
              v-model="dataForm.mainPersonMobile"
              placeholder="联系人电话"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="60px" label="邮箱" prop="mainPersonEmail">
            <el-input
              v-model="dataForm.mainPersonEmail"
              size="medium"
              placeholder="联系人邮箱"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item
          v-if="dialogStatus !== 'create'"
          label="企业状态"
          size="mini"
          prop="status"
          required
        >
          <el-radio-group v-model="dataForm.status">
            <el-radio
              v-for="(val, key) in STS.ktfStatus"
              :key="key"
              :label="val.key"
            >
              {{ val.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item v-if="showAttachment" label="企业附件" prop="">
          <el-upload
            ref="upload"
            class="upload-recordDetail"
            :action="uploadUrl"
            name="file"
            :auto-upload="false"
            multiple
            :file-list="fileList"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            :on-change="handleChange"
          >
            <el-button slot="trigger" size="small" type="primary">
              点击上传
            </el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >
              上传到服务器
            </el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传不超过10M大小的文件
            </div>
          </el-upload>
          <el-carousel
            v-if="carouselVisible"
            :interval="4000"
            type="card"
            height="200px"
            style="border:1px solid #fff"
          >
            <el-carousel-item v-for="item in imgList" :key="item.name">
              <h3>{{ item.name }}</h3>
              <img :src="item.url" alt="picture" width="100%" height="80%" />
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ LB.common.CANCEL }}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{
        LB.common.CONFIRM
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import treeInput from '@/components/TreeInput'
import dynamicCascader from '@/components/DynamicCascader'
// import multiSelect from '@/components/MultiSelect'

import {
  getInfo,
  save,
  update,
  removeFileById,
  removeFileByName,
  ENTERPRISE_TYPES
} from '@/api/org/corp'
import { isEmail, isMobile, validAlphabets } from '@/utils/validate'
import {
  getChildren as industryGetChildren,
  getInfo as getIndustryInfo
} from '@/api/sys/industry'
import { provinces, getChildren as regionGetChildren } from '@/api/sys/region'
export default {
  name: 'OrgCorpDlg',
  directives: { elDragDialog },
  components: { treeInput, dynamicCascader },
  props: {
    dialogStatus: {
      type: String,
      default: 'create'
    }
  },
  data() {
    const validateIndustry = (rule, value, callback) => {
      if (!value || !value.label || !value.value) {
        callback(new Error('所属行业不能为空'))
      } else {
        callback()
      }
    }
    const validateRegion = (rule, value, callback) => {
      if (!value || !value.province) {
        callback(new Error('所属地区不能为空'))
      } else {
        callback()
      }
    }
    const validateAbbr = (rule, value, callback) => {
      if (!validAlphabets(value)) {
        callback(new Error('企业缩写必须为字母'))
      } else if (value.length > 6) {
        callback(new Error('企业缩写长度不能超过6'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号无效'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('eMail无效'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      popoverVisible: false,
      showAttachment: false,
      dataForm: {
        id: 0,
        name: null,
        abbr: '',
        uscc: '',
        type: null,
        appId: null,
        industry: {},
        region: {},
        mainPerson: '',
        mainPersonMobile: '',
        mainPersonEmail: '',
        address: '',
        zipCode: ''
      },
      textMap: {
        update: '修改数据',
        create: '新增数据'
      },
      uploadUrl: '',
      fileList: [],
      imgList: [],
      carouselVisible: false,
      rules: {
        name: [
          {
            required: true,
            message: '企业名称不能为空',
            trigger: 'blur'
          }
        ],
        abbr: [
          {
            required: true,
            validator: validateAbbr,
            trigger: 'blur'
          }
        ],
        uscc: [
          {
            required: true,
            message: '企业社会统一信用代码不能为空',
            trigger: 'blur'
          }
        ],
        industry: [
          {
            required: true,
            validator: validateIndustry,
            trigger: 'change'
          }
        ],
        region: [
          {
            // type: 'array',
            required: true,
            validator: validateRegion,
            trigger: 'change'
          }
        ],
        mainPerson: [
          {
            required: true,
            message: '企业联系人不能为空',
            trigger: 'blur'
          }
        ],
        mainPersonMobile: [
          {
            required: true,
            validator: validateMobile,
            trigger: 'blur'
          }
        ],
        mainPersonEmail: [
          {
            required: true,
            validator: validateEmail,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    entTypes: {
      get() {
        return ENTERPRISE_TYPES
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    init(id) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          getInfo(this.dataForm.id).then(({ code, msg, data }) => {
            if (code === 200) {
              this.dataForm = data
              // this.industryTreeSetCurrentNode(this.dataForm.industryId)
            } else {
              this.$message.error(msg)
            }
          })
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.saveOrUpdate().then(({ code, msg, data }) => {
            if (code === 200) {
              this.$message({
                message:
                  this.dialogStatus === 'create' ? '保存成功' : '更新成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(msg)
            }
          })
        }
      })
    },
    saveOrUpdate() {
      return this.dialogStatus === 'create'
        ? save(this.dataForm)
        : update(this.dataForm)
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      var id = file.id
      var fileName = file.name
      const promise = file.id ? removeFileById(id) : removeFileByName(fileName)
      promise.then(({ code, msg, data }) => {
        if (code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
        } else {
          this.$message.error(msg)
        }
      })
      this.handleChange(file, fileList)
    },
    handlePreview(file, fileList) {
      window.open(file.url)
    },
    handleChange(file, fileList) {
      this.imgList = []
      var x
      for (x in fileList) {
        var fi = {
          name: fileList[x].name,
          url: fileList[x].url
        }
        if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileList[x].name)) {
          this.imgList.push(fi)
        }
      }
      if (this.imgList.length > 0) {
        this.carouselVisible = true
      } else {
        this.carouselVisible = false
      }
    },
    // 菜单树设置当前选中节点
    // industryTreeSetCurrentNode(industryId) {
    //   this.$refs.industryTreeInput.setCurrentKey(industryId)
    // },
    async getIndustryTreeData(industryId) {
      const res = await industryGetChildren(industryId)
      return res
    },
    async getMyInfo(id) {
      const res = await getIndustryInfo(id)
      return res
    },
    abbrChange(value) {
      this.dataForm.abbr = value.toUpperCase()
    },
    queryRegion(pid = '') {
      if (!pid) {
        return provinces()
      } else {
        return regionGetChildren(pid)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

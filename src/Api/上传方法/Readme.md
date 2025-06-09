配置项：
  必填项：
    id: String | 文件上传 input 标签的 id;
    fail_count: Num | 最大重试次数;
    upload_url: String | 上传接口 URL;
    token: String | 用户 token;

  非必填项：
    small_file_slice_size: Num | 小于 50M 文件的切片大小, 默认值为 10M;
    large_file_slice_size: Num | 大于 50M 文件的切片大小, 默认值为 40M;
    uploadStart: fn | 上传开始时执行;
    uploadFail: fn(count, md5, name) | 上传失败时执行, count 为重试次数, md5 为失败文件或切片的 MD5, name 为文件名;
    uploadSuccess: fn(res, file) | 上传完成时执行, res 为上传接口响应内容, file 为上传的文件;
    uploadProgress: fn(cur_index, total, formData) | 上传时执行, cur_index 为当前正在传输的切片序号, total 为切片总数, formData 为上传请求的 data, 可向其中 append 接口需要的额外数据;
    readStart: fn | 开始读取大文件时执行;
    readProgress: fn(cur_index, total) | 大文件读取切片进度, cur_index 和 total 同上;

示例：
Upload({
          id: 'fileUpload',
          // small_file_slice_size: 10,
          // large_file_slice_size: 40,
          fail_count: fail_count,
          upload_url: `${upload_url}/${catalogueId}`,
          custom_params: {},
          token: this.token,
          uploadStart: () => {
            // 开始上传时执行
            console.log('开始上传');
            this.loadingText = '开始上传';
            this.uploading = true;
          },
          uploadFail: (i, md5, name) => {
            // 上传失败时执行
            console.log('上传失败', i);
            if (i < fail_count) {
              this.loadingText = '上传失败正在重试 （' + i + '/' + fail_count + '次）';
            } else {
              this.uploading = false;
              this.request('delete', `${cleanCache}${md5}?fileName=${name}`, this.token, (res) => {
                console.log(res);
                if (res.head.code == 200) {
                }
              });
              this.$message.error('重试次数达到上限，上传失败');
            }
          },
          uploadSuccess: (res, file) => {
            // 上传完成时执行
            console.log('上传完成');
            if (this.menuHeaderList.length > 0) {
              this.searchTree(this.menuHeaderList[this.menuHeaderList.length - 1].id);
            } else {
              this.searchTree();
            }
            this.uploading = false;
            this.$message({
              message: '上传成功',
              type: 'success',
            });
          },
          uploadProgress: (cur_index, total, formData) => {
            // 上传进度
            console.log('上传进度：' + cur_index + ' :' + total);
            this.loadingText = `正在传输第 ${cur_index} 片/共 ${total} 片`;
            // this.loadingText = '正在传输第 ' + cur_index + '片/共' + total + '片';
            if (cur_index == total) {
              console.log(thumbnailFile);
              if (thumbnailFile != undefined) {
                formData.append('thumbnailImage', thumbnailFile);
              }
              this.loadingText = '即将完成，请稍等';
            }
          },
          readStart: () => {
            // 开始读取大文件时执行
            this.loadingText = '读取文件';
            this.uploading = true;
            this.loadingText = '正在处理文件';
          },
          readProgress: (cur_index, total) => {
            // 读取大文件进度
            console.log('已处理 ' + parseInt((cur_index / total) * 100) + '%');
            this.loadingText = '已处理 ' + parseInt((cur_index / total) * 100) + '%';
          },
        });

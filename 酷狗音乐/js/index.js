window.onload = function () {

    let aVal = document.getElementsByClassName('search-bar-input')[0]//获取顶部input输入框
    let aBtn = document.getElementsByClassName('search-bar-img')[0]//获取放大镜
    let oAud = document.getElementsByClassName('center-head-img')[0]//获取播放杆
    let aCD = document.getElementsByClassName('box-CD')[0]//获取CD光盘
    let aCDimg = document.getElementsByClassName('box-zp-cours')[0]//获取img的转动

    let aUl = document.getElementsByTagName('ul');//获取左右两侧的ul列表
    let oul = aUl[0].getElementsByTagName('span');//获取播放列表的每一项下标
    let aaaa = document.querySelector('.bottom-audio');//获取底部播放音乐接口
    let cours = document.getElementsByClassName('box-zp-cours')[0]//获取中间的歌手头像
    let mvUrl = '';//把获取mv的数据地址放入mvUrl中
    let arr = []//把最初始数据放入到空数组内

    //音乐关闭麦克上移CD关闭旋转事件
    aaaa.onpause=function(){
        oAud.classList.remove('center-head-img1')
        aCD.classList.remove('box-CD1')
        aCDimg.classList.remove('box-zp-cours1')
    }
    //音乐打开麦克下移CD开始旋转事件
    aaaa.onplay=function(){
        oAud.classList.add('center-head-img1')
        aCD.classList.add('box-CD1')
        aCDimg.classList.add('box-zp-cours1')
    }
    //同时判断是不是按得回车键盘
    aVal.addEventListener('keyup',function(event){
        event.preventDefault();
        if(event.keyCode==13){
            aBtn.onclick()
            aUl[0].onclick()
        }
    })
            
    //放大镜的点击事件
    aBtn.onclick = function () {
        aUl[0].innerHTML = ''//把左侧初始数据清空
    //获取歌曲列表
        axios({
            method: 'get',
            url: 'https://apimusic.linweiqin.com/search',
            params: {
                keywords: aVal.value,
            }
        }).then((res) => {//数据请求成功
            arr = res.data.result.songs//把最初始数据放入到空数组
            arr.forEach((item) => {
            //mvid (是否包含mv,0表示不包含)  
                if (item.mvid != 0) {
                    aUl[0].innerHTML += `
                        <li><span></span>${item.name}<div></div></li>`
                } else {
                    aUl[0].innerHTML += `
                        <li><span></span>${item.name}</li>`
                }
            });

        //获取歌曲id
            axios({
                method: 'get',
                url: 'https://apimusic.linweiqin.com/comment/hot?type=0',
                params: {
                    id: arr[0].id,
                }
            }).then((res) => {
                // console.log(res.data.hotComments)
                res.data.hotComments.forEach((items) => {
                // 右侧获取评论信息用户头像评论内容
                    aUl[1].innerHTML += `
                        <img src="${items.user.avatarUrl}" alt="">
                        <span>${items.user.nickname}</span>
                        <li>${items.content}</li>`
                });
            })
        })
    }

    //通过事件传递操作子元素
    aUl[0].onclick = function (ev) {
        if (ev.target.nodeName == 'SPAN') {//如果点击的是span
            let i = [...oul].indexOf(ev.target);
            console.log(i)

    //获取歌曲id
            axios({
                method: 'get',
                url: 'https://apimusic.linweiqin.com/comment/hot?type=0',
                params: {
                    id: arr[i].id,
                }
            }).then(res => {
                aUl[1].innerHTML = ''
                // 右侧插入新的评论信息用户头像评论内容
                res.data.hotComments.forEach((items) => {//循环他的每一项
                    aUl[1].innerHTML += `
                    <img src="${items.user.avatarUrl}" alt="">
                    <span>${items.user.nickname}</span>
                    <li>${items.content}</li>`
                });

    //获取音乐封面接口
                axios({
                    method: 'GET',
                    url: 'https://apimusic.linweiqin.com/song/detail',
                    params: {
                        ids: arr[i].id,
                    }
                }).then(res => {
                    console.log('封面接口', res)
                    cours.src = res.data.songs[0].al.picUrl
                });
            })
        }

    // 判断点击的是不是DIV
        if (ev.target.nodeName = 'DIV') {
            let i = [...this.children].indexOf(ev.target.parentNode);
            //mv播放接口
            axios({
                method: 'GET',
                url: 'https://apimusic.linweiqin.com/mv/url',
                params: {
                    id: arr[i].mvid,
                }
            }).then(res => {
                console.log('播放mv接口', res)
                mvUrl = res.data.data.url;
        //判断点击的是不是SPAN
                if(ev.target.nodeName == 'SPAN'){
                    
        //获取播放音乐接口
                    axios({
                        method: 'GET',
                        url: 'https://apimusic.linweiqin.com/song/url',
                        params: {
                            id: arr[i].id,
                        }
                    }).then(res => {
                        console.log('播放音乐接口', res)
                        aaaa.src = res.data.data[0].url
                        //console.log(res.data.data.url)
                    });
                }else{//否则就跳转到mvUrl页面
                    window.open(mvUrl)
                    //location.href = mvUrl;
                }    
            });
        }
    }
}


# 改成私有变量：

```
egret_string_code 已改
```

# egret下面的方法转移空间名
```
将getString改到Logger下面

egret.__callAsync--->MainContext

```

# 去掉的js列表
```
        "egret/utils/SAXParser.ts",
        "egret/utils/XML.ts",

        "egret/events/EventPhase.ts",

        "egret/display/ScrollView.ts",
        "egret/display/Sprite.ts",

        "egret/utils/getTimer.ts",  合并到Ticker.ts中，并且把__START_TIME改成私有

        "egret/utils/hasDefinition.ts",
        "egret/utils/callLater.ts",     合并到MainContext.ts中，并将一些变量改成私有

        "egret/tween/Tween.ts",
        "egret/tween/Ease.ts",
                需要把Ease中的常量复制到mo_act.Ease中


        "egret/display/MovieClip.ts",
        "egret/display/MovieClipData.ts",
        "egret/display/MovieClipDataFactory.ts",

        "egret/utils/getQualifiedClassName.ts", 因为只有Injector里面需要，GUI的我们没用，所以直接把方法内容复制过去。
                NativeSocket.ts中加上__global的初始化
        "egret/utils/getDefinitionByName.ts",   egret_loader.js, native_require.js


        "egret/display/FrameLabel.ts",
        "egret/text/HtmlTextParser.ts",
```

# 将不用的类挪出来

```
```

# 常量修改空间名为egret.consts

```
BlendMode       UIImage.ts

HorizontalAlign         UITextDefine.ts
VerticalAlign           UITextDefine.ts

StageScaleMode          egret_loader.js native_require.js

BitmapFillMode

TextFieldType
InteractionMode
Endian
```


# 待处理
```
ExternalInterface
```

# 将适配相关的改到egret.resolution命名空间下

```
StageDelegate.ts
```

# 修改socket相关的空间名为egret_socket

```
其中，ByteArray.ts路径没改，但是空间名先改成egret_socket了。
```

# 修改egret_sin_map、egret_cos_map

# 将net文件夹下面的都转移到egret.net命名空间下

# 将event都挪到egret.evt下面
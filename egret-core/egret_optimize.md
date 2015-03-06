
# 改成私有变量：

```
egret_string_code 已改
```

# egret下面的方法转移空间名
```
将getString改到Logger下面

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
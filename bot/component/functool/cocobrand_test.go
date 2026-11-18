package functool

import (
	"context"
	"strings"
	"testing"

	"github.com/jeanhua/AniaBot/bot/component/llmtool"
)

// CocoBot 保留上游技能名与配置接口，但自身说明不能把用户引导回上游发行版。
func TestBuiltinAniabotCocoBotBranding(t *testing.T) {
	_, manager, err := CreateToolsWithSkill(nil, t.TempDir(), BashConfig{}, FileConfig{}, LocalImageConfig{}, FileToolsConfig{}, nil, true)
	if err != nil {
		t.Fatalf("CreateToolsWithSkill error: %v", err)
	}
	readTool := llmtool.NewSkillReadTool(manager)
	cases := []struct {
		name string
		file string
		want []string
	}{
		{"主体", "", []string{"CocoBot", "AniaBot", "./CocoBot -set-password", "https://github.com/oldplum/CocoBot.git", "antiwithdrawal", "whitelist"}},
		{"配置参考", "reference/config.md", []string{"CocoBot", "bot.update.git_url", "https://github.com/oldplum/CocoBot.git"}},
		{"面板参考", "reference/panel.md", []string{"./CocoBot -set-password", "CocoBot 仓库"}},
		{"排障参考", "reference/troubleshooting.md", []string{"./CocoBot -set-password"}},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			out, err := readTool.Execute(context.Background(), &llmtool.SkillReadParams{SkillName: "aniabot", FileName: tc.file}, llmtool.CallBackFuncs{})
			if err != nil {
				t.Fatalf("读取技能失败: %v", err)
			}
			for _, want := range tc.want {
				if !strings.Contains(out, want) {
					t.Errorf("技能说明缺少 %q", want)
				}
			}
			if strings.Contains(out, "./AniaBot -set-password") {
				t.Error("技能说明仍使用上游二进制名称")
			}
		})
	}
}
